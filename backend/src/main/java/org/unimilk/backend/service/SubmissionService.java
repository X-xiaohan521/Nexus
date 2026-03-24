package org.unimilk.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.unimilk.backend.dto.SubmissionDto;
import org.unimilk.backend.entity.Submission;
import org.unimilk.backend.repo.SubmissionRepo;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class SubmissionService {
    private final SubmissionRepo submissionRepo;

    @Autowired
    public SubmissionService(SubmissionRepo submissionRepo) {
        this.submissionRepo = submissionRepo;
    }

    public List<SubmissionDto> getSubmissionsByUserId(Integer userId) {
        List<Submission> submissions = submissionRepo.findByUserIdOrderBySubmissionTimeDesc(userId);
        AtomicInteger id = new AtomicInteger(submissions.size());
        return submissions.stream()
                .map(submission -> new SubmissionDto(id.getAndDecrement(), submission.getStatus(), submission.getScore(), submission.getSubmissionTime()))
                .toList();
    }
}
