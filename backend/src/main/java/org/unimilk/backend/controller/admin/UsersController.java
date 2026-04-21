package org.unimilk.backend.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.UserService;

@RestController
@RequestMapping("/api/admin/users")
public class UsersController {
    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UniResponse getAllUsers() {
        return UniResponse.success(userService.getAllUsers());
    }
}
