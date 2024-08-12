package co.id.diti.fcs.repository;

import co.id.diti.fcs.domain.TaskHistory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TaskHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {}
