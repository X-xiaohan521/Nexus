package org.unimilk.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unimilk.backend.entity.Submission;

@Repository
public interface SubmissionRepo extends JpaRepository<Submission, Integer> {

}
