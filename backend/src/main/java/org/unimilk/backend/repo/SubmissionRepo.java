package org.unimilk.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unimilk.backend.entity.Submission;
import org.unimilk.backend.entity.User;

import java.util.List;

@Repository
public interface SubmissionRepo extends JpaRepository<Submission, Integer> {
    List<Submission> findByUserOrderByScoreDesc(User user);
    List<Submission> findByUserIdOrderBySubmissionTimeDesc(Integer userId);
}
