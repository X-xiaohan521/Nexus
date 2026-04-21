package org.unimilk.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.unimilk.backend.dto.UserDetailDto;
import org.unimilk.backend.entity.User;
import org.unimilk.backend.repo.UserRepo;

import java.util.List;

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
}
