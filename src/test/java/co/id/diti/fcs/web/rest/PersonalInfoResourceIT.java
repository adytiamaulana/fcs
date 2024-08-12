package co.id.diti.fcs.web.rest;

import static co.id.diti.fcs.domain.PersonalInfoAsserts.*;
import static co.id.diti.fcs.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.id.diti.fcs.IntegrationTest;
import co.id.diti.fcs.domain.PersonalInfo;
import co.id.diti.fcs.repository.PersonalInfoRepository;
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
 * Integration tests for the {@link PersonalInfoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PersonalInfoResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_GENDER = "AAAAAAAAAA";
    private static final String UPDATED_GENDER = "BBBBBBBBBB";

    private static final String DEFAULT_BIRTH_DATE = "AAAAAAAAAA";
    private static final String UPDATED_BIRTH_DATE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_AT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_AT = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_UPDATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_UPDATED_AT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATED_AT = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DELETED_BY = "AAAAAAAAAA";
    private static final String UPDATED_DELETED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DELETED_AT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DELETED_AT = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/personal-infos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PersonalInfoRepository personalInfoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPersonalInfoMockMvc;

    private PersonalInfo personalInfo;

    private PersonalInfo insertedPersonalInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonalInfo createEntity(EntityManager em) {
        PersonalInfo personalInfo = new PersonalInfo()
            .name(DEFAULT_NAME)
            .gender(DEFAULT_GENDER)
            .birthDate(DEFAULT_BIRTH_DATE)
            .telephone(DEFAULT_TELEPHONE)
            .createdBy(DEFAULT_CREATED_BY)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedBy(DEFAULT_UPDATED_BY)
            .updatedAt(DEFAULT_UPDATED_AT)
            .deletedBy(DEFAULT_DELETED_BY)
            .deletedAt(DEFAULT_DELETED_AT);
        return personalInfo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonalInfo createUpdatedEntity(EntityManager em) {
        PersonalInfo personalInfo = new PersonalInfo()
            .name(UPDATED_NAME)
            .gender(UPDATED_GENDER)
            .birthDate(UPDATED_BIRTH_DATE)
            .telephone(UPDATED_TELEPHONE)
            .createdBy(UPDATED_CREATED_BY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedBy(UPDATED_UPDATED_BY)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedBy(UPDATED_DELETED_BY)
            .deletedAt(UPDATED_DELETED_AT);
        return personalInfo;
    }

    @BeforeEach
    public void initTest() {
        personalInfo = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedPersonalInfo != null) {
            personalInfoRepository.delete(insertedPersonalInfo);
            insertedPersonalInfo = null;
        }
    }

    @Test
    @Transactional
    void createPersonalInfo() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PersonalInfo
        var returnedPersonalInfo = om.readValue(
            restPersonalInfoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(personalInfo)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PersonalInfo.class
        );

        // Validate the PersonalInfo in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPersonalInfoUpdatableFieldsEquals(returnedPersonalInfo, getPersistedPersonalInfo(returnedPersonalInfo));

        insertedPersonalInfo = returnedPersonalInfo;
    }

    @Test
    @Transactional
    void createPersonalInfoWithExistingId() throws Exception {
        // Create the PersonalInfo with an existing ID
        personalInfo.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPersonalInfoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(personalInfo)))
            .andExpect(status().isBadRequest());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPersonalInfos() throws Exception {
        // Initialize the database
        insertedPersonalInfo = personalInfoRepository.saveAndFlush(personalInfo);

        // Get all the personalInfoList
        restPersonalInfoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(personalInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER)))
            .andExpect(jsonPath("$.[*].birthDate").value(hasItem(DEFAULT_BIRTH_DATE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedBy").value(hasItem(DEFAULT_UPDATED_BY)))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())))
            .andExpect(jsonPath("$.[*].deletedBy").value(hasItem(DEFAULT_DELETED_BY)))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(DEFAULT_DELETED_AT.toString())));
    }

    @Test
    @Transactional
    void getPersonalInfo() throws Exception {
        // Initialize the database
        insertedPersonalInfo = personalInfoRepository.saveAndFlush(personalInfo);

        // Get the personalInfo
        restPersonalInfoMockMvc
            .perform(get(ENTITY_API_URL_ID, personalInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(personalInfo.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER))
            .andExpect(jsonPath("$.birthDate").value(DEFAULT_BIRTH_DATE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedBy").value(DEFAULT_UPDATED_BY))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()))
            .andExpect(jsonPath("$.deletedBy").value(DEFAULT_DELETED_BY))
            .andExpect(jsonPath("$.deletedAt").value(DEFAULT_DELETED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPersonalInfo() throws Exception {
        // Get the personalInfo
        restPersonalInfoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPersonalInfo() throws Exception {
        // Initialize the database
        insertedPersonalInfo = personalInfoRepository.saveAndFlush(personalInfo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the personalInfo
        PersonalInfo updatedPersonalInfo = personalInfoRepository.findById(personalInfo.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPersonalInfo are not directly saved in db
        em.detach(updatedPersonalInfo);
        updatedPersonalInfo
            .name(UPDATED_NAME)
            .gender(UPDATED_GENDER)
            .birthDate(UPDATED_BIRTH_DATE)
            .telephone(UPDATED_TELEPHONE)
            .createdBy(UPDATED_CREATED_BY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedBy(UPDATED_UPDATED_BY)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedBy(UPDATED_DELETED_BY)
            .deletedAt(UPDATED_DELETED_AT);

        restPersonalInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPersonalInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPersonalInfo))
            )
            .andExpect(status().isOk());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPersonalInfoToMatchAllProperties(updatedPersonalInfo);
    }

    @Test
    @Transactional
    void putNonExistingPersonalInfo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        personalInfo.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonalInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, personalInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(personalInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPersonalInfo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        personalInfo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(personalInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPersonalInfo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        personalInfo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalInfoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(personalInfo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePersonalInfoWithPatch() throws Exception {
        // Initialize the database
        insertedPersonalInfo = personalInfoRepository.saveAndFlush(personalInfo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the personalInfo using partial update
        PersonalInfo partialUpdatedPersonalInfo = new PersonalInfo();
        partialUpdatedPersonalInfo.setId(personalInfo.getId());

        partialUpdatedPersonalInfo
            .birthDate(UPDATED_BIRTH_DATE)
            .telephone(UPDATED_TELEPHONE)
            .createdAt(UPDATED_CREATED_AT)
            .deletedBy(UPDATED_DELETED_BY);

        restPersonalInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonalInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPersonalInfo))
            )
            .andExpect(status().isOk());

        // Validate the PersonalInfo in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersonalInfoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPersonalInfo, personalInfo),
            getPersistedPersonalInfo(personalInfo)
        );
    }

    @Test
    @Transactional
    void fullUpdatePersonalInfoWithPatch() throws Exception {
        // Initialize the database
        insertedPersonalInfo = personalInfoRepository.saveAndFlush(personalInfo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the personalInfo using partial update
        PersonalInfo partialUpdatedPersonalInfo = new PersonalInfo();
        partialUpdatedPersonalInfo.setId(personalInfo.getId());

        partialUpdatedPersonalInfo
            .name(UPDATED_NAME)
            .gender(UPDATED_GENDER)
            .birthDate(UPDATED_BIRTH_DATE)
            .telephone(UPDATED_TELEPHONE)
            .createdBy(UPDATED_CREATED_BY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedBy(UPDATED_UPDATED_BY)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedBy(UPDATED_DELETED_BY)
            .deletedAt(UPDATED_DELETED_AT);

        restPersonalInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonalInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPersonalInfo))
            )
            .andExpect(status().isOk());

        // Validate the PersonalInfo in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersonalInfoUpdatableFieldsEquals(partialUpdatedPersonalInfo, getPersistedPersonalInfo(partialUpdatedPersonalInfo));
    }

    @Test
    @Transactional
    void patchNonExistingPersonalInfo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        personalInfo.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonalInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, personalInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(personalInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPersonalInfo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        personalInfo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(personalInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPersonalInfo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        personalInfo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalInfoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(personalInfo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonalInfo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePersonalInfo() throws Exception {
        // Initialize the database
        insertedPersonalInfo = personalInfoRepository.saveAndFlush(personalInfo);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the personalInfo
        restPersonalInfoMockMvc
            .perform(delete(ENTITY_API_URL_ID, personalInfo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return personalInfoRepository.count();
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

    protected PersonalInfo getPersistedPersonalInfo(PersonalInfo personalInfo) {
        return personalInfoRepository.findById(personalInfo.getId()).orElseThrow();
    }

    protected void assertPersistedPersonalInfoToMatchAllProperties(PersonalInfo expectedPersonalInfo) {
        assertPersonalInfoAllPropertiesEquals(expectedPersonalInfo, getPersistedPersonalInfo(expectedPersonalInfo));
    }

    protected void assertPersistedPersonalInfoToMatchUpdatableProperties(PersonalInfo expectedPersonalInfo) {
        assertPersonalInfoAllUpdatablePropertiesEquals(expectedPersonalInfo, getPersistedPersonalInfo(expectedPersonalInfo));
    }
}
