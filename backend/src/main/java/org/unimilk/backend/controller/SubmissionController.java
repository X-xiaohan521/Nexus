package org.unimilk.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.unimilk.backend.dto.SubmissionDto;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.SubmissionService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/submission")
public class SubmissionController {
    private final SubmissionService submissionService;

    @Autowired
    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping
    public UniResponse getSubmissions(HttpServletRequest req) {
        Integer userId = (Integer) req.getAttribute("id");
        List<SubmissionDto> submissions = submissionService.getSubmissionsByUserId(userId);
        return UniResponse.success(submissions);
    }

    @PostMapping
    public UniResponse onSubmit(HttpServletRequest req, MultipartFile file) {
        submissionService.onSubmit((Integer) req.getAttribute("id"), (String) req.getAttribute("username"), file, LocalDateTime.now());
        return UniResponse.success();
    }
}
