package co.id.diti.fcs.service;

import co.id.diti.fcs.domain.*; // for static metamodels
import co.id.diti.fcs.domain.TaskHistory;
import co.id.diti.fcs.repository.TaskHistoryRepository;
import co.id.diti.fcs.service.criteria.TaskHistoryCriteria;
import jakarta.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link TaskHistory} entities in the database.
 * The main input is a {@link TaskHistoryCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link TaskHistory} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class TaskHistoryQueryService extends QueryService<TaskHistory> {

    private static final Logger log = LoggerFactory.getLogger(TaskHistoryQueryService.class);

    private final TaskHistoryRepository taskHistoryRepository;

    public TaskHistoryQueryService(TaskHistoryRepository taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }

    /**
     * Return a {@link Page} of {@link TaskHistory} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<TaskHistory> findByCriteria(TaskHistoryCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<TaskHistory> specification = createSpecification(criteria);
        return taskHistoryRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(TaskHistoryCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<TaskHistory> specification = createSpecification(criteria);
        return taskHistoryRepository.count(specification);
    }

    /**
     * Function to convert {@link TaskHistoryCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<TaskHistory> createSpecification(TaskHistoryCriteria criteria) {
        Specification<TaskHistory> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), TaskHistory_.id));
            }
            if (criteria.getBranch() != null) {
                specification = specification.and(buildStringSpecification(criteria.getBranch(), TaskHistory_.branch));
            }
            if (criteria.getStartDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getStartDate(), TaskHistory_.startDate));
            }
            if (criteria.getEndDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getEndDate(), TaskHistory_.endDate));
            }
            if (criteria.getPersonalInfoId() != null) {
                specification = specification.and(
                    buildSpecification(
                        criteria.getPersonalInfoId(),
                        root -> root.join(TaskHistory_.personalInfo, JoinType.LEFT).get(PersonalInfo_.id)
                    )
                );
            }
            if (criteria.getApplicationStatusId() != null) {
                specification = specification.and(
                    buildSpecification(
                        criteria.getApplicationStatusId(),
                        root -> root.join(TaskHistory_.applicationStatus, JoinType.LEFT).get(ApplicationStatus_.id)
                    )
                );
            }
        }
        return specification;
    }
}
