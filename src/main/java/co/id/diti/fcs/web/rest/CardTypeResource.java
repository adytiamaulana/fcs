package co.id.diti.fcs.web.rest;

import co.id.diti.fcs.domain.CardType;
import co.id.diti.fcs.repository.CardTypeRepository;
import co.id.diti.fcs.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.id.diti.fcs.domain.CardType}.
 */
@RestController
@RequestMapping("/api/card-types")
@Transactional
public class CardTypeResource {

    private static final Logger log = LoggerFactory.getLogger(CardTypeResource.class);

    private static final String ENTITY_NAME = "cardType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CardTypeRepository cardTypeRepository;

    public CardTypeResource(CardTypeRepository cardTypeRepository) {
        this.cardTypeRepository = cardTypeRepository;
    }

    /**
     * {@code POST  /card-types} : Create a new cardType.
     *
     * @param cardType the cardType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cardType, or with status {@code 400 (Bad Request)} if the cardType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CardType> createCardType(@RequestBody CardType cardType) throws URISyntaxException {
        log.debug("REST request to save CardType : {}", cardType);
        if (cardType.getId() != null) {
            throw new BadRequestAlertException("A new cardType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        cardType = cardTypeRepository.save(cardType);
        return ResponseEntity.created(new URI("/api/card-types/" + cardType.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, cardType.getId().toString()))
            .body(cardType);
    }

    /**
     * {@code PUT  /card-types/:id} : Updates an existing cardType.
     *
     * @param id the id of the cardType to save.
     * @param cardType the cardType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cardType,
     * or with status {@code 400 (Bad Request)} if the cardType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cardType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CardType> updateCardType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CardType cardType
    ) throws URISyntaxException {
        log.debug("REST request to update CardType : {}, {}", id, cardType);
        if (cardType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cardType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cardTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        cardType = cardTypeRepository.save(cardType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, cardType.getId().toString()))
            .body(cardType);
    }

    /**
     * {@code PATCH  /card-types/:id} : Partial updates given fields of an existing cardType, field will ignore if it is null
     *
     * @param id the id of the cardType to save.
     * @param cardType the cardType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cardType,
     * or with status {@code 400 (Bad Request)} if the cardType is not valid,
     * or with status {@code 404 (Not Found)} if the cardType is not found,
     * or with status {@code 500 (Internal Server Error)} if the cardType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CardType> partialUpdateCardType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CardType cardType
    ) throws URISyntaxException {
        log.debug("REST request to partial update CardType partially : {}, {}", id, cardType);
        if (cardType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cardType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cardTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CardType> result = cardTypeRepository
            .findById(cardType.getId())
            .map(existingCardType -> {
                if (cardType.getCardCode() != null) {
                    existingCardType.setCardCode(cardType.getCardCode());
                }
                if (cardType.getCardName() != null) {
                    existingCardType.setCardName(cardType.getCardName());
                }
                if (cardType.getCreatedBy() != null) {
                    existingCardType.setCreatedBy(cardType.getCreatedBy());
                }
                if (cardType.getCreatedAt() != null) {
                    existingCardType.setCreatedAt(cardType.getCreatedAt());
                }
                if (cardType.getUpdatedBy() != null) {
                    existingCardType.setUpdatedBy(cardType.getUpdatedBy());
                }
                if (cardType.getUpdatedAt() != null) {
                    existingCardType.setUpdatedAt(cardType.getUpdatedAt());
                }
                if (cardType.getDeletedBy() != null) {
                    existingCardType.setDeletedBy(cardType.getDeletedBy());
                }
                if (cardType.getDeletedAt() != null) {
                    existingCardType.setDeletedAt(cardType.getDeletedAt());
                }

                return existingCardType;
            })
            .map(cardTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, cardType.getId().toString())
        );
    }

    /**
     * {@code GET  /card-types} : get all the cardTypes.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cardTypes in body.
     */
    @GetMapping("")
    public ResponseEntity<List<CardType>> getAllCardTypes(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("personalinfo-is-null".equals(filter)) {
            log.debug("REST request to get all CardTypes where personalInfo is null");
            return new ResponseEntity<>(
                StreamSupport.stream(cardTypeRepository.findAll().spliterator(), false)
                    .filter(cardType -> cardType.getPersonalInfo() == null)
                    .toList(),
                HttpStatus.OK
            );
        }
        log.debug("REST request to get a page of CardTypes");
        Page<CardType> page = cardTypeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /card-types/:id} : get the "id" cardType.
     *
     * @param id the id of the cardType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cardType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CardType> getCardType(@PathVariable("id") Long id) {
        log.debug("REST request to get CardType : {}", id);
        Optional<CardType> cardType = cardTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cardType);
    }

    /**
     * {@code DELETE  /card-types/:id} : delete the "id" cardType.
     *
     * @param id the id of the cardType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCardType(@PathVariable("id") Long id) {
        log.debug("REST request to delete CardType : {}", id);
        cardTypeRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
