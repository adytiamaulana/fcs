package co.id.diti.fcs.repository;

import co.id.diti.fcs.domain.ApplicationStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ApplicationStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationStatusRepository extends JpaRepository<ApplicationStatus, Long> {}
