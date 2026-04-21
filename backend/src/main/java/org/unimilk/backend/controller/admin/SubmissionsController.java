package org.unimilk.backend.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.unimilk.backend.dto.SubmissionDetailDto;
import org.unimilk.backend.dto.SubmissionLessDto;
import org.unimilk.backend.dto.SubmissionsQueryConditionDto;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.SubmissionService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/submission")
public class SubmissionsController {
    private final SubmissionService submissionService;

    @Autowired
    public SubmissionsController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping
    public UniResponse getAllSubmissions(@RequestParam(value = "username", required = false) String username,
                                         @RequestParam(value = "dateRange", required = false) String dateRange) {
        List<SubmissionLessDto> allSubmissions = submissionService.getAllSubmissionsByCondition(new SubmissionsQueryConditionDto(username, dateRange));
        return UniResponse.success(allSubmissions);
    }

    @GetMapping("/{id}")
    public UniResponse getSubmissionDetail(@PathVariable String id) {
        try {
            SubmissionDetailDto submissionDetail = submissionService.getSubmissionDetailById(Integer.parseInt(id));
            return UniResponse.success(submissionDetail);
        } catch (NumberFormatException e) {
            throw new BusinessException("请传入正确有效的 id。", "Failed to get submission detail: invalid id " + id);
        }
    }
}
