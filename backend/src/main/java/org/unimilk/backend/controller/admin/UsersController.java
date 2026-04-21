package org.unimilk.backend.controller.admin;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.request.UpdateUserRequest;
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

    @PutMapping("/{id}")
    public UniResponse updateUser(@PathVariable String id,
                                  @RequestBody UpdateUserRequest updateUserRequest) {
        try {
            userService.updateUser(Integer.parseInt(id), updateUserRequest);
            return UniResponse.success(null, "修改成功~");
        } catch (NumberFormatException e) {
            throw new BusinessException("请传入正确有效的 id。", "Failed to update user info: invalid id " + id);
        }
    }

    @DeleteMapping("/{id}")
    public UniResponse deleteUser(@PathVariable String id, HttpServletRequest req) {
        try {
            userService.deleteUser(Integer.parseInt(id), (Integer) req.getAttribute("id"));
            return UniResponse.success(null, "删除成功~");
        } catch (NumberFormatException e) {
            throw new BusinessException("请传入正确有效的 id。", "Failed to delete user: invalid id " + id);
        }
    }
}
