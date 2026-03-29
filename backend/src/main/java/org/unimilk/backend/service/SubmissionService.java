package org.unimilk.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.unimilk.backend.dto.SubmissionDto;
import org.unimilk.backend.entity.Submission;
import org.unimilk.backend.entity.User;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.mq.EvalReqProvider;
import org.unimilk.backend.repo.SubmissionRepo;
import org.unimilk.backend.repo.UserRepo;
import org.unimilk.backend.request.EvaluateRequest;
import org.unimilk.backend.response.EvaluateResult;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

@Slf4j
@Service
public class SubmissionService {
    @Value("${app.data.directory}")
    private String dataDir;

    private final SubmissionRepo submissionRepo;
    private final UserRepo userRepo;
    private final EvalReqProvider evalReqProvider;

    @Autowired
    public SubmissionService(SubmissionRepo submissionRepo, UserRepo userRepo, EvalReqProvider evalReqProvider) {
        this.submissionRepo = submissionRepo;
        this.userRepo = userRepo;
        this.evalReqProvider = evalReqProvider;
    }

    public List<SubmissionDto> getSubmissionsByUserId(Integer userId) {
        List<Submission> submissions = submissionRepo.findByUserIdOrderBySubmissionTimeDesc(userId);
        AtomicInteger id = new AtomicInteger(submissions.size());
        return submissions.stream()
                .map(submission -> new SubmissionDto(id.getAndDecrement(), submission.getStatus(), submission.getScore(), submission.getSubmissionTime()))
                .toList();
    }

    @Transactional
    public void onSubmit(Integer userId, String username, MultipartFile file, LocalDateTime submitTime) {
        // 1. validate the file
        validateFile(username, file);

        // 2. save the file & generate file access path
        String originalFilename = file.getOriginalFilename();
        assert originalFilename != null;
        String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID() + suffix;
        Path filePath = Path.of(dataDir, "submission", username, newFilename);
        String fileUri = Path.of("submission", username, newFilename).toString();

        try {
            File dest = new File(filePath.toUri());
            if (!dest.getParentFile().exists()) {
                boolean isDirsMade = dest.getParentFile().mkdirs();
                if (!isDirsMade) {
                    throw new IOException("Cannot make parent folders.");
                }
            }
            file.transferTo(dest);
        } catch (IOException e) {
            throw new BusinessException("Internal server error: cannot save file.", e);
        }

        // 3. save a record to the submission database
        User user = userRepo.findById(userId).orElseThrow(() -> new BusinessException("用户不存在，请联系管理员。", "User id " + userId + " not found."));
        Submission submission = new Submission(null, fileUri, 3, null, null, submitTime, user);
        Submission savedSubmission = submissionRepo.save(submission);

        // 4. kick off a worker to evaluate via mq.evaluate.request
        try {
            startEvaluating(savedSubmission.getId(), savedSubmission.getFileUri());
        } catch (Exception e) {
            throw new BusinessException("服务器异常，请联系管理员。", "Failed to start evaluating: unable to connect to MQ.", e);
        }
    }

    private static void validateFile(String username, MultipartFile file) {
        if (file.getOriginalFilename() == null) {
            throw new BusinessException("文件名不允许为空！", "User " + username + " uploaded a file with an empty file name, frontend may be cracked.");
        } else if (!file.getOriginalFilename().endsWith(".csv")) {
            throw new BusinessException("仅允许提交 .csv 文件！", "User " + username + " uploaded an illegal file, frontend may be cracked.");
        } else if (file.getSize() > 10485760) {
            throw new BusinessException("最大文件大小不得超过 10MB。", "User " + username + " uploaded a file larger than 10 MB, frontend may be cracked.");
        } else if (file.getName().length() > 50) {
            throw new BusinessException("文件名长度不得超过 50 个字符。", "User " + username + " uploaded a file with a name longer than 50 characters, frontend may be cracked.");
        } else if (!Pattern.matches("^[ \u4e00-\u9fa5a-zA-Z0-9._-]+$", file.getName())) {
            throw new BusinessException("文件名只允许包含：中文/英文字符、数字、小数点、下划线、横线。", "User " + username + " uploaded a file with an illegal name, frontend may be cracked.");
        }
    }

    private void startEvaluating(Integer submissionId, String fileUri) {
        // 1. prepare eval request
        EvaluateRequest request = new EvaluateRequest(
                submissionId,
                fileUri,
                UUID.randomUUID().toString(),
                System.currentTimeMillis()
        );
        log.info("Sending request to evaluator: {}", request);

        // 2. send request
        evalReqProvider.sendEvalReq(request);
    }

    @Transactional
    public void onFinishEvaluating(EvaluateResult result) {
        // 1. find the corresponding submission via submissionId
        Submission submission = submissionRepo.findById(result.submissionId()).orElse(null);
        if (submission == null) {
            log.error("Failed to save evaluate result {}: cannot find submission id {}.", result.callbackId(), result.submissionId());
            return;
        }

        // 2. check if the status is 3(running), else return
        if (!Objects.equals(3, submission.getStatus())) {
            log.warn("Failed to save evaluate result {}: status of submission id {} is not 3(running).", result.callbackId(), submission.getId());
        }

        // 3. update status 3 -> 0(failed) / 1(success)
        submission.setStatus(result.status());

        // 4. update other info
        switch (submission.getStatus()) {
            // 4.1 status: 0 -> update err_msg
            case 0:
                submission.setErrMsg(result.errorMsg());

            // 4.2 status: 1 -> update score
            case 1:
                submission.setScore(result.score());
        }

        submissionRepo.save(submission);
    }
}
