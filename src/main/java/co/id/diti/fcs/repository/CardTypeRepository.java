package co.id.diti.fcs.repository;

import co.id.diti.fcs.domain.CardType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CardType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CardTypeRepository extends JpaRepository<CardType, Long> {}
