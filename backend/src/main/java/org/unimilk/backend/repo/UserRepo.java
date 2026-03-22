package org.unimilk.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unimilk.backend.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

}
