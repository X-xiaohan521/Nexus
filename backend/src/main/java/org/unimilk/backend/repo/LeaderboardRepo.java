package org.unimilk.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unimilk.backend.entity.Leader;

import java.util.List;

@Repository
public interface LeaderboardRepo extends JpaRepository<Leader, Integer> {

}
