package org.unimilk.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unimilk.backend.entity.Leader;

@Repository
public interface LeaderboardRepo extends JpaRepository<Leader, Integer> {

}
