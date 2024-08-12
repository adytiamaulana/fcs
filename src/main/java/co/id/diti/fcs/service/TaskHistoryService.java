package co.id.diti.fcs.service;

import co.id.diti.fcs.domain.TaskHistory;
import co.id.diti.fcs.repository.TaskHistoryRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link co.id.diti.fcs.domain.TaskHistory}.
 */
@Service
@Transactional
public class TaskHistoryService {

    private static final Logger log = LoggerFactory.getLogger(TaskHistoryService.class);

    private final TaskHistoryRepository taskHistoryRepository;

    public TaskHistoryService(TaskHistoryRepository taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }

    /**
     * Save a taskHistory.
     *
     * @param taskHistory the entity to save.
     * @return the persisted entity.
     */
    public TaskHistory save(TaskHistory taskHistory) {
        log.debug("Request to save TaskHistory : {}", taskHistory);
        return taskHistoryRepository.save(taskHistory);
    }

    /**
     * Update a taskHistory.
     *
     * @param taskHistory the entity to save.
     * @return the persisted entity.
     */
    public TaskHistory update(TaskHistory taskHistory) {
        log.debug("Request to update TaskHistory : {}", taskHistory);
        return taskHistoryRepository.save(taskHistory);
    }

    /**
     * Partially update a taskHistory.
     *
     * @param taskHistory the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TaskHistory> partialUpdate(TaskHistory taskHistory) {
        log.debug("Request to partially update TaskHistory : {}", taskHistory);

        return taskHistoryRepository
            .findById(taskHistory.getId())
            .map(existingTaskHistory -> {
                if (taskHistory.getBranch() != null) {
                    existingTaskHistory.setBranch(taskHistory.getBranch());
                }
                if (taskHistory.getStartDate() != null) {
                    existingTaskHistory.setStartDate(taskHistory.getStartDate());
                }
                if (taskHistory.getEndDate() != null) {
                    existingTaskHistory.setEndDate(taskHistory.getEndDate());
                }

                return existingTaskHistory;
            })
            .map(taskHistoryRepository::save);
    }

    /**
     * Get one taskHistory by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TaskHistory> findOne(Long id) {
        log.debug("Request to get TaskHistory : {}", id);
        return taskHistoryRepository.findById(id);
    }

    /**
     * Delete the taskHistory by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TaskHistory : {}", id);
        taskHistoryRepository.deleteById(id);
    }
}
