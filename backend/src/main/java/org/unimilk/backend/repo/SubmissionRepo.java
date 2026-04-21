package org.unimilk.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.unimilk.backend.entity.Submission;
import org.unimilk.backend.entity.User;

import java.util.List;

@Repository
public interface SubmissionRepo extends JpaRepository<Submission, Integer>, JpaSpecificationExecutor<Submission> {
    List<Submission> findByUserId(Integer userId);
    List<Submission> findByUserOrderByScoreDesc(User user);
    List<Submission> findByUserIdOrderBySubmissionTimeDesc(Integer userId);
}
