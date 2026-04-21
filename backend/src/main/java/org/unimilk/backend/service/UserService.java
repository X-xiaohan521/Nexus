package org.unimilk.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unimilk.backend.dto.UserDetailDto;
import org.unimilk.backend.entity.User;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.repo.UserRepo;
import org.unimilk.backend.request.UpdateUserRequest;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {
    private final UserRepo userRepo;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public List<UserDetailDto> getAllUsers() {
        List<User> users = userRepo.findAll();
        return users.stream().map((user) -> new UserDetailDto(user.getId(), user.getUsername(), user.getRole(), user.getAllowSubmit())).toList();
    }

    @Transactional
    public void updateUser(Integer id, UpdateUserRequest updateUserRequest) {
        User user = userRepo.findById(id).orElseThrow(() -> new BusinessException("找不到 id 为 " + id + " 的用户。", "Failed to update user info: user id " + id + " not found."));
        if (Objects.equals(updateUserRequest.allowSubmit(), 0)) {
            user.setAllowSubmit(0);
        } else if (Objects.equals(updateUserRequest.allowSubmit(), 1)) {
            user.setAllowSubmit(1);
        } else {
            throw new BusinessException("请传入有效的参数。", "Failed to update user info: field allowSubmit=" + updateUserRequest.allowSubmit() + " is invalid.");
        }
        userRepo.save(user);
    }
}
