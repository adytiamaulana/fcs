package co.id.diti.fcs.web.rest;

import static co.id.diti.fcs.domain.ApplicationStatusAsserts.*;
import static co.id.diti.fcs.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.id.diti.fcs.IntegrationTest;
import co.id.diti.fcs.domain.ApplicationStatus;
import co.id.diti.fcs.repository.ApplicationStatusRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link ApplicationStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ApplicationStatusResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final String DEFAULT_UPDATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATED_BY = "BBBBBBBBBB";

    private static final String DEFAULT_DELETED_BY = "AAAAAAAAAA";
    private static final String UPDATED_DELETED_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/application-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ApplicationStatusRepository applicationStatusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restApplicationStatusMockMvc;

    private ApplicationStatus applicationStatus;

    private ApplicationStatus insertedApplicationStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationStatus createEntity(EntityManager em) {
        ApplicationStatus applicationStatus = new ApplicationStatus()
            .code(DEFAULT_CODE)
            .status(DEFAULT_STATUS)
            .createdBy(DEFAULT_CREATED_BY)
            .updatedBy(DEFAULT_UPDATED_BY)
            .deletedBy(DEFAULT_DELETED_BY);
        return applicationStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationStatus createUpdatedEntity(EntityManager em) {
        ApplicationStatus applicationStatus = new ApplicationStatus()
            .code(UPDATED_CODE)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .updatedBy(UPDATED_UPDATED_BY)
            .deletedBy(UPDATED_DELETED_BY);
        return applicationStatus;
    }

    @BeforeEach
    public void initTest() {
        applicationStatus = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedApplicationStatus != null) {
            applicationStatusRepository.delete(insertedApplicationStatus);
            insertedApplicationStatus = null;
        }
    }

    @Test
    @Transactional
    void createApplicationStatus() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ApplicationStatus
        var returnedApplicationStatus = om.readValue(
            restApplicationStatusMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(applicationStatus)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ApplicationStatus.class
        );

        // Validate the ApplicationStatus in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertApplicationStatusUpdatableFieldsEquals(returnedApplicationStatus, getPersistedApplicationStatus(returnedApplicationStatus));

        insertedApplicationStatus = returnedApplicationStatus;
    }

    @Test
    @Transactional
    void createApplicationStatusWithExistingId() throws Exception {
        // Create the ApplicationStatus with an existing ID
        applicationStatus.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restApplicationStatusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(applicationStatus)))
            .andExpect(status().isBadRequest());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllApplicationStatuses() throws Exception {
        // Initialize the database
        insertedApplicationStatus = applicationStatusRepository.saveAndFlush(applicationStatus);

        // Get all the applicationStatusList
        restApplicationStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(applicationStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].updatedBy").value(hasItem(DEFAULT_UPDATED_BY)))
            .andExpect(jsonPath("$.[*].deletedBy").value(hasItem(DEFAULT_DELETED_BY)));
    }

    @Test
    @Transactional
    void getApplicationStatus() throws Exception {
        // Initialize the database
        insertedApplicationStatus = applicationStatusRepository.saveAndFlush(applicationStatus);

        // Get the applicationStatus
        restApplicationStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, applicationStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(applicationStatus.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.updatedBy").value(DEFAULT_UPDATED_BY))
            .andExpect(jsonPath("$.deletedBy").value(DEFAULT_DELETED_BY));
    }

    @Test
    @Transactional
    void getNonExistingApplicationStatus() throws Exception {
        // Get the applicationStatus
        restApplicationStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingApplicationStatus() throws Exception {
        // Initialize the database
        insertedApplicationStatus = applicationStatusRepository.saveAndFlush(applicationStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the applicationStatus
        ApplicationStatus updatedApplicationStatus = applicationStatusRepository.findById(applicationStatus.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedApplicationStatus are not directly saved in db
        em.detach(updatedApplicationStatus);
        updatedApplicationStatus
            .code(UPDATED_CODE)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .updatedBy(UPDATED_UPDATED_BY)
            .deletedBy(UPDATED_DELETED_BY);

        restApplicationStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedApplicationStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedApplicationStatus))
            )
            .andExpect(status().isOk());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedApplicationStatusToMatchAllProperties(updatedApplicationStatus);
    }

    @Test
    @Transactional
    void putNonExistingApplicationStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        applicationStatus.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, applicationStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(applicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchApplicationStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        applicationStatus.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(applicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamApplicationStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        applicationStatus.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationStatusMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(applicationStatus)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateApplicationStatusWithPatch() throws Exception {
        // Initialize the database
        insertedApplicationStatus = applicationStatusRepository.saveAndFlush(applicationStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the applicationStatus using partial update
        ApplicationStatus partialUpdatedApplicationStatus = new ApplicationStatus();
        partialUpdatedApplicationStatus.setId(applicationStatus.getId());

        partialUpdatedApplicationStatus.code(UPDATED_CODE).updatedBy(UPDATED_UPDATED_BY).deletedBy(UPDATED_DELETED_BY);

        restApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplicationStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedApplicationStatus))
            )
            .andExpect(status().isOk());

        // Validate the ApplicationStatus in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertApplicationStatusUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedApplicationStatus, applicationStatus),
            getPersistedApplicationStatus(applicationStatus)
        );
    }

    @Test
    @Transactional
    void fullUpdateApplicationStatusWithPatch() throws Exception {
        // Initialize the database
        insertedApplicationStatus = applicationStatusRepository.saveAndFlush(applicationStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the applicationStatus using partial update
        ApplicationStatus partialUpdatedApplicationStatus = new ApplicationStatus();
        partialUpdatedApplicationStatus.setId(applicationStatus.getId());

        partialUpdatedApplicationStatus
            .code(UPDATED_CODE)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .updatedBy(UPDATED_UPDATED_BY)
            .deletedBy(UPDATED_DELETED_BY);

        restApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplicationStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedApplicationStatus))
            )
            .andExpect(status().isOk());

        // Validate the ApplicationStatus in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertApplicationStatusUpdatableFieldsEquals(
            partialUpdatedApplicationStatus,
            getPersistedApplicationStatus(partialUpdatedApplicationStatus)
        );
    }

    @Test
    @Transactional
    void patchNonExistingApplicationStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        applicationStatus.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, applicationStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(applicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchApplicationStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        applicationStatus.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(applicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamApplicationStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        applicationStatus.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationStatusMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(applicationStatus)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ApplicationStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteApplicationStatus() throws Exception {
        // Initialize the database
        insertedApplicationStatus = applicationStatusRepository.saveAndFlush(applicationStatus);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the applicationStatus
        restApplicationStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, applicationStatus.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return applicationStatusRepository.count();
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

    protected ApplicationStatus getPersistedApplicationStatus(ApplicationStatus applicationStatus) {
        return applicationStatusRepository.findById(applicationStatus.getId()).orElseThrow();
    }

    protected void assertPersistedApplicationStatusToMatchAllProperties(ApplicationStatus expectedApplicationStatus) {
        assertApplicationStatusAllPropertiesEquals(expectedApplicationStatus, getPersistedApplicationStatus(expectedApplicationStatus));
    }

    protected void assertPersistedApplicationStatusToMatchUpdatableProperties(ApplicationStatus expectedApplicationStatus) {
        assertApplicationStatusAllUpdatablePropertiesEquals(
            expectedApplicationStatus,
            getPersistedApplicationStatus(expectedApplicationStatus)
        );
    }
}
