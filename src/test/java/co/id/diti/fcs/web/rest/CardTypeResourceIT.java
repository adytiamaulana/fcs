package co.id.diti.fcs.web.rest;

import static co.id.diti.fcs.domain.CardTypeAsserts.*;
import static co.id.diti.fcs.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.id.diti.fcs.IntegrationTest;
import co.id.diti.fcs.domain.CardType;
import co.id.diti.fcs.repository.CardTypeRepository;
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
 * Integration tests for the {@link CardTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CardTypeResourceIT {

    private static final Integer DEFAULT_CARD_CODE = 1;
    private static final Integer UPDATED_CARD_CODE = 2;

    private static final String DEFAULT_CARD_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CARD_NAME = "BBBBBBBBBB";

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

    private static final String ENTITY_API_URL = "/api/card-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CardTypeRepository cardTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCardTypeMockMvc;

    private CardType cardType;

    private CardType insertedCardType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CardType createEntity(EntityManager em) {
        CardType cardType = new CardType()
            .cardCode(DEFAULT_CARD_CODE)
            .cardName(DEFAULT_CARD_NAME)
            .createdBy(DEFAULT_CREATED_BY)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedBy(DEFAULT_UPDATED_BY)
            .updatedAt(DEFAULT_UPDATED_AT)
            .deletedBy(DEFAULT_DELETED_BY)
            .deletedAt(DEFAULT_DELETED_AT);
        return cardType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CardType createUpdatedEntity(EntityManager em) {
        CardType cardType = new CardType()
            .cardCode(UPDATED_CARD_CODE)
            .cardName(UPDATED_CARD_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedBy(UPDATED_UPDATED_BY)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedBy(UPDATED_DELETED_BY)
            .deletedAt(UPDATED_DELETED_AT);
        return cardType;
    }

    @BeforeEach
    public void initTest() {
        cardType = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedCardType != null) {
            cardTypeRepository.delete(insertedCardType);
            insertedCardType = null;
        }
    }

    @Test
    @Transactional
    void createCardType() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CardType
        var returnedCardType = om.readValue(
            restCardTypeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cardType)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CardType.class
        );

        // Validate the CardType in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCardTypeUpdatableFieldsEquals(returnedCardType, getPersistedCardType(returnedCardType));

        insertedCardType = returnedCardType;
    }

    @Test
    @Transactional
    void createCardTypeWithExistingId() throws Exception {
        // Create the CardType with an existing ID
        cardType.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCardTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cardType)))
            .andExpect(status().isBadRequest());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCardTypes() throws Exception {
        // Initialize the database
        insertedCardType = cardTypeRepository.saveAndFlush(cardType);

        // Get all the cardTypeList
        restCardTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cardType.getId().intValue())))
            .andExpect(jsonPath("$.[*].cardCode").value(hasItem(DEFAULT_CARD_CODE)))
            .andExpect(jsonPath("$.[*].cardName").value(hasItem(DEFAULT_CARD_NAME)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedBy").value(hasItem(DEFAULT_UPDATED_BY)))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())))
            .andExpect(jsonPath("$.[*].deletedBy").value(hasItem(DEFAULT_DELETED_BY)))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(DEFAULT_DELETED_AT.toString())));
    }

    @Test
    @Transactional
    void getCardType() throws Exception {
        // Initialize the database
        insertedCardType = cardTypeRepository.saveAndFlush(cardType);

        // Get the cardType
        restCardTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, cardType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cardType.getId().intValue()))
            .andExpect(jsonPath("$.cardCode").value(DEFAULT_CARD_CODE))
            .andExpect(jsonPath("$.cardName").value(DEFAULT_CARD_NAME))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedBy").value(DEFAULT_UPDATED_BY))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()))
            .andExpect(jsonPath("$.deletedBy").value(DEFAULT_DELETED_BY))
            .andExpect(jsonPath("$.deletedAt").value(DEFAULT_DELETED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCardType() throws Exception {
        // Get the cardType
        restCardTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCardType() throws Exception {
        // Initialize the database
        insertedCardType = cardTypeRepository.saveAndFlush(cardType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cardType
        CardType updatedCardType = cardTypeRepository.findById(cardType.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCardType are not directly saved in db
        em.detach(updatedCardType);
        updatedCardType
            .cardCode(UPDATED_CARD_CODE)
            .cardName(UPDATED_CARD_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedBy(UPDATED_UPDATED_BY)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedBy(UPDATED_DELETED_BY)
            .deletedAt(UPDATED_DELETED_AT);

        restCardTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCardType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCardType))
            )
            .andExpect(status().isOk());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCardTypeToMatchAllProperties(updatedCardType);
    }

    @Test
    @Transactional
    void putNonExistingCardType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cardType.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCardTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cardType.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cardType))
            )
            .andExpect(status().isBadRequest());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCardType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cardType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cardType))
            )
            .andExpect(status().isBadRequest());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCardType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cardType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cardType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCardTypeWithPatch() throws Exception {
        // Initialize the database
        insertedCardType = cardTypeRepository.saveAndFlush(cardType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cardType using partial update
        CardType partialUpdatedCardType = new CardType();
        partialUpdatedCardType.setId(cardType.getId());

        partialUpdatedCardType
            .cardCode(UPDATED_CARD_CODE)
            .cardName(UPDATED_CARD_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdAt(UPDATED_CREATED_AT);

        restCardTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCardType.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCardType))
            )
            .andExpect(status().isOk());

        // Validate the CardType in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCardTypeUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCardType, cardType), getPersistedCardType(cardType));
    }

    @Test
    @Transactional
    void fullUpdateCardTypeWithPatch() throws Exception {
        // Initialize the database
        insertedCardType = cardTypeRepository.saveAndFlush(cardType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cardType using partial update
        CardType partialUpdatedCardType = new CardType();
        partialUpdatedCardType.setId(cardType.getId());

        partialUpdatedCardType
            .cardCode(UPDATED_CARD_CODE)
            .cardName(UPDATED_CARD_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedBy(UPDATED_UPDATED_BY)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedBy(UPDATED_DELETED_BY)
            .deletedAt(UPDATED_DELETED_AT);

        restCardTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCardType.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCardType))
            )
            .andExpect(status().isOk());

        // Validate the CardType in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCardTypeUpdatableFieldsEquals(partialUpdatedCardType, getPersistedCardType(partialUpdatedCardType));
    }

    @Test
    @Transactional
    void patchNonExistingCardType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cardType.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCardTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cardType.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cardType))
            )
            .andExpect(status().isBadRequest());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCardType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cardType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cardType))
            )
            .andExpect(status().isBadRequest());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCardType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cardType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCardTypeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cardType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CardType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCardType() throws Exception {
        // Initialize the database
        insertedCardType = cardTypeRepository.saveAndFlush(cardType);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the cardType
        restCardTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, cardType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return cardTypeRepository.count();
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

    protected CardType getPersistedCardType(CardType cardType) {
        return cardTypeRepository.findById(cardType.getId()).orElseThrow();
    }

    protected void assertPersistedCardTypeToMatchAllProperties(CardType expectedCardType) {
        assertCardTypeAllPropertiesEquals(expectedCardType, getPersistedCardType(expectedCardType));
    }

    protected void assertPersistedCardTypeToMatchUpdatableProperties(CardType expectedCardType) {
        assertCardTypeAllUpdatablePropertiesEquals(expectedCardType, getPersistedCardType(expectedCardType));
    }
}
