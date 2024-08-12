package co.id.diti.fcs.repository;

import co.id.diti.fcs.domain.PersonalInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PersonalInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {}
