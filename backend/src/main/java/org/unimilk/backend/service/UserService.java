package org.unimilk.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unimilk.backend.dto.UserDetailDto;
import org.unimilk.backend.entity.User;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.repo.SubmissionRepo;
import org.unimilk.backend.repo.UserRepo;
import org.unimilk.backend.request.UpdateUserRequest;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {
    private final UserRepo userRepo;
    private final SubmissionRepo submissionRepo;

    @Autowired
    public UserService(UserRepo userRepo, SubmissionRepo submissionRepo) {
        this.userRepo = userRepo;
        this.submissionRepo = submissionRepo;
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

    @Transactional
    public void deleteUser(Integer idToBeDeleted, Integer idOfOperator) {
        if (Objects.equals(idToBeDeleted, idOfOperator)) {
            throw new BusinessException("你不能删除自己的账户。", "Failed to delete user id " + idToBeDeleted + ": user cannot delete self.");
        }
        User userToBeDeleted = userRepo.findById(idToBeDeleted).orElseThrow(() -> new BusinessException("找不到 id 为 " + idToBeDeleted + " 的用户。", "Failed to update user info: user id " + idToBeDeleted + " not found."));
        if (Objects.equals(userToBeDeleted.getRole(), 1)) {
            throw new BusinessException("不能删除管理员账户。", "Failed to delete user id " + idToBeDeleted + ": cannot delete admin.");
        }
        submissionRepo.deleteAll(submissionRepo.findByUserId(idToBeDeleted));
        userRepo.delete(userToBeDeleted);
    }
}
