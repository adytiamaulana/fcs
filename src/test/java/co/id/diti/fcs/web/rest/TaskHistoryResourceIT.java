package co.id.diti.fcs.web.rest;

import static co.id.diti.fcs.domain.TaskHistoryAsserts.*;
import static co.id.diti.fcs.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.id.diti.fcs.IntegrationTest;
import co.id.diti.fcs.domain.ApplicationStatus;
import co.id.diti.fcs.domain.PersonalInfo;
import co.id.diti.fcs.domain.TaskHistory;
import co.id.diti.fcs.repository.TaskHistoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TaskHistoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TaskHistoryResourceIT {

    private static final String DEFAULT_BRANCH = "AAAAAAAAAA";
    private static final String UPDATED_BRANCH = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_START_DATE = LocalDate.ofEpochDay(-1L);

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_END_DATE = LocalDate.ofEpochDay(-1L);

    private static final String ENTITY_API_URL = "/api/task-histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TaskHistoryRepository taskHistoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTaskHistoryMockMvc;

    private TaskHistory taskHistory;

    private TaskHistory insertedTaskHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TaskHistory createEntity(EntityManager em) {
        TaskHistory taskHistory = new TaskHistory().branch(DEFAULT_BRANCH).startDate(DEFAULT_START_DATE).endDate(DEFAULT_END_DATE);
        return taskHistory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TaskHistory createUpdatedEntity(EntityManager em) {
        TaskHistory taskHistory = new TaskHistory().branch(UPDATED_BRANCH).startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);
        return taskHistory;
    }

    @BeforeEach
    public void initTest() {
        taskHistory = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedTaskHistory != null) {
            taskHistoryRepository.delete(insertedTaskHistory);
            insertedTaskHistory = null;
        }
    }

    @Test
    @Transactional
    void createTaskHistory() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TaskHistory
        var returnedTaskHistory = om.readValue(
            restTaskHistoryMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(taskHistory)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TaskHistory.class
        );

        // Validate the TaskHistory in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTaskHistoryUpdatableFieldsEquals(returnedTaskHistory, getPersistedTaskHistory(returnedTaskHistory));

        insertedTaskHistory = returnedTaskHistory;
    }

    @Test
    @Transactional
    void createTaskHistoryWithExistingId() throws Exception {
        // Create the TaskHistory with an existing ID
        taskHistory.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(taskHistory)))
            .andExpect(status().isBadRequest());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTaskHistories() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList
        restTaskHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].branch").value(hasItem(DEFAULT_BRANCH)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getTaskHistory() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get the taskHistory
        restTaskHistoryMockMvc
            .perform(get(ENTITY_API_URL_ID, taskHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(taskHistory.getId().intValue()))
            .andExpect(jsonPath("$.branch").value(DEFAULT_BRANCH))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getTaskHistoriesByIdFiltering() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        Long id = taskHistory.getId();

        defaultTaskHistoryFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultTaskHistoryFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultTaskHistoryFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByBranchIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where branch equals to
        defaultTaskHistoryFiltering("branch.equals=" + DEFAULT_BRANCH, "branch.equals=" + UPDATED_BRANCH);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByBranchIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where branch in
        defaultTaskHistoryFiltering("branch.in=" + DEFAULT_BRANCH + "," + UPDATED_BRANCH, "branch.in=" + UPDATED_BRANCH);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByBranchIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where branch is not null
        defaultTaskHistoryFiltering("branch.specified=true", "branch.specified=false");
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByBranchContainsSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where branch contains
        defaultTaskHistoryFiltering("branch.contains=" + DEFAULT_BRANCH, "branch.contains=" + UPDATED_BRANCH);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByBranchNotContainsSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where branch does not contain
        defaultTaskHistoryFiltering("branch.doesNotContain=" + UPDATED_BRANCH, "branch.doesNotContain=" + DEFAULT_BRANCH);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByStartDateIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where startDate equals to
        defaultTaskHistoryFiltering("startDate.equals=" + DEFAULT_START_DATE, "startDate.equals=" + UPDATED_START_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByStartDateIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where startDate in
        defaultTaskHistoryFiltering("startDate.in=" + DEFAULT_START_DATE + "," + UPDATED_START_DATE, "startDate.in=" + UPDATED_START_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByStartDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where startDate is not null
        defaultTaskHistoryFiltering("startDate.specified=true", "startDate.specified=false");
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByStartDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where startDate is greater than or equal to
        defaultTaskHistoryFiltering(
            "startDate.greaterThanOrEqual=" + DEFAULT_START_DATE,
            "startDate.greaterThanOrEqual=" + UPDATED_START_DATE
        );
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByStartDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where startDate is less than or equal to
        defaultTaskHistoryFiltering("startDate.lessThanOrEqual=" + DEFAULT_START_DATE, "startDate.lessThanOrEqual=" + SMALLER_START_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByStartDateIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where startDate is less than
        defaultTaskHistoryFiltering("startDate.lessThan=" + UPDATED_START_DATE, "startDate.lessThan=" + DEFAULT_START_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByStartDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where startDate is greater than
        defaultTaskHistoryFiltering("startDate.greaterThan=" + SMALLER_START_DATE, "startDate.greaterThan=" + DEFAULT_START_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByEndDateIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where endDate equals to
        defaultTaskHistoryFiltering("endDate.equals=" + DEFAULT_END_DATE, "endDate.equals=" + UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByEndDateIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where endDate in
        defaultTaskHistoryFiltering("endDate.in=" + DEFAULT_END_DATE + "," + UPDATED_END_DATE, "endDate.in=" + UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByEndDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where endDate is not null
        defaultTaskHistoryFiltering("endDate.specified=true", "endDate.specified=false");
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByEndDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where endDate is greater than or equal to
        defaultTaskHistoryFiltering("endDate.greaterThanOrEqual=" + DEFAULT_END_DATE, "endDate.greaterThanOrEqual=" + UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByEndDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where endDate is less than or equal to
        defaultTaskHistoryFiltering("endDate.lessThanOrEqual=" + DEFAULT_END_DATE, "endDate.lessThanOrEqual=" + SMALLER_END_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByEndDateIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where endDate is less than
        defaultTaskHistoryFiltering("endDate.lessThan=" + UPDATED_END_DATE, "endDate.lessThan=" + DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByEndDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        // Get all the taskHistoryList where endDate is greater than
        defaultTaskHistoryFiltering("endDate.greaterThan=" + SMALLER_END_DATE, "endDate.greaterThan=" + DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByPersonalInfoIsEqualToSomething() throws Exception {
        PersonalInfo personalInfo;
        if (TestUtil.findAll(em, PersonalInfo.class).isEmpty()) {
            taskHistoryRepository.saveAndFlush(taskHistory);
            personalInfo = PersonalInfoResourceIT.createEntity(em);
        } else {
            personalInfo = TestUtil.findAll(em, PersonalInfo.class).get(0);
        }
        em.persist(personalInfo);
        em.flush();
        taskHistory.setPersonalInfo(personalInfo);
        taskHistoryRepository.saveAndFlush(taskHistory);
        Long personalInfoId = personalInfo.getId();
        // Get all the taskHistoryList where personalInfo equals to personalInfoId
        defaultTaskHistoryShouldBeFound("personalInfoId.equals=" + personalInfoId);

        // Get all the taskHistoryList where personalInfo equals to (personalInfoId + 1)
        defaultTaskHistoryShouldNotBeFound("personalInfoId.equals=" + (personalInfoId + 1));
    }

    @Test
    @Transactional
    void getAllTaskHistoriesByApplicationStatusIsEqualToSomething() throws Exception {
        ApplicationStatus applicationStatus;
        if (TestUtil.findAll(em, ApplicationStatus.class).isEmpty()) {
            taskHistoryRepository.saveAndFlush(taskHistory);
            applicationStatus = ApplicationStatusResourceIT.createEntity(em);
        } else {
            applicationStatus = TestUtil.findAll(em, ApplicationStatus.class).get(0);
        }
        em.persist(applicationStatus);
        em.flush();
        taskHistory.setApplicationStatus(applicationStatus);
        taskHistoryRepository.saveAndFlush(taskHistory);
        Long applicationStatusId = applicationStatus.getId();
        // Get all the taskHistoryList where applicationStatus equals to applicationStatusId
        defaultTaskHistoryShouldBeFound("applicationStatusId.equals=" + applicationStatusId);

        // Get all the taskHistoryList where applicationStatus equals to (applicationStatusId + 1)
        defaultTaskHistoryShouldNotBeFound("applicationStatusId.equals=" + (applicationStatusId + 1));
    }

    private void defaultTaskHistoryFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultTaskHistoryShouldBeFound(shouldBeFound);
        defaultTaskHistoryShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultTaskHistoryShouldBeFound(String filter) throws Exception {
        restTaskHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].branch").value(hasItem(DEFAULT_BRANCH)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));

        // Check, that the count call also returns 1
        restTaskHistoryMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultTaskHistoryShouldNotBeFound(String filter) throws Exception {
        restTaskHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restTaskHistoryMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingTaskHistory() throws Exception {
        // Get the taskHistory
        restTaskHistoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTaskHistory() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the taskHistory
        TaskHistory updatedTaskHistory = taskHistoryRepository.findById(taskHistory.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTaskHistory are not directly saved in db
        em.detach(updatedTaskHistory);
        updatedTaskHistory.branch(UPDATED_BRANCH).startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);

        restTaskHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTaskHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTaskHistory))
            )
            .andExpect(status().isOk());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTaskHistoryToMatchAllProperties(updatedTaskHistory);
    }

    @Test
    @Transactional
    void putNonExistingTaskHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskHistory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, taskHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(taskHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTaskHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(taskHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTaskHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskHistoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(taskHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTaskHistoryWithPatch() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the taskHistory using partial update
        TaskHistory partialUpdatedTaskHistory = new TaskHistory();
        partialUpdatedTaskHistory.setId(taskHistory.getId());

        partialUpdatedTaskHistory.branch(UPDATED_BRANCH);

        restTaskHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTaskHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTaskHistory))
            )
            .andExpect(status().isOk());

        // Validate the TaskHistory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTaskHistoryUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTaskHistory, taskHistory),
            getPersistedTaskHistory(taskHistory)
        );
    }

    @Test
    @Transactional
    void fullUpdateTaskHistoryWithPatch() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the taskHistory using partial update
        TaskHistory partialUpdatedTaskHistory = new TaskHistory();
        partialUpdatedTaskHistory.setId(taskHistory.getId());

        partialUpdatedTaskHistory.branch(UPDATED_BRANCH).startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);

        restTaskHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTaskHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTaskHistory))
            )
            .andExpect(status().isOk());

        // Validate the TaskHistory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTaskHistoryUpdatableFieldsEquals(partialUpdatedTaskHistory, getPersistedTaskHistory(partialUpdatedTaskHistory));
    }

    @Test
    @Transactional
    void patchNonExistingTaskHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskHistory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, taskHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(taskHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTaskHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(taskHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTaskHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskHistoryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(taskHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TaskHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTaskHistory() throws Exception {
        // Initialize the database
        insertedTaskHistory = taskHistoryRepository.saveAndFlush(taskHistory);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the taskHistory
        restTaskHistoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, taskHistory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return taskHistoryRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected TaskHistory getPersistedTaskHistory(TaskHistory taskHistory) {
        return taskHistoryRepository.findById(taskHistory.getId()).orElseThrow();
    }

    protected void assertPersistedTaskHistoryToMatchAllProperties(TaskHistory expectedTaskHistory) {
        assertTaskHistoryAllPropertiesEquals(expectedTaskHistory, getPersistedTaskHistory(expectedTaskHistory));
    }

    protected void assertPersistedTaskHistoryToMatchUpdatableProperties(TaskHistory expectedTaskHistory) {
        assertTaskHistoryAllUpdatablePropertiesEquals(expectedTaskHistory, getPersistedTaskHistory(expectedTaskHistory));
    }
}
