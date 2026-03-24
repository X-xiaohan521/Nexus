package org.unimilk.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unimilk.backend.dto.SubmissionDto;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.SubmissionService;

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
}
