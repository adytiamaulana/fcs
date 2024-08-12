package co.id.diti.fcs.web.rest;

import co.id.diti.fcs.domain.PersonalInfo;
import co.id.diti.fcs.repository.PersonalInfoRepository;
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
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.id.diti.fcs.domain.PersonalInfo}.
 */
@RestController
@RequestMapping("/api/personal-infos")
@Transactional
public class PersonalInfoResource {

    private static final Logger log = LoggerFactory.getLogger(PersonalInfoResource.class);

    private static final String ENTITY_NAME = "personalInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonalInfoRepository personalInfoRepository;

    public PersonalInfoResource(PersonalInfoRepository personalInfoRepository) {
        this.personalInfoRepository = personalInfoRepository;
    }

    /**
     * {@code POST  /personal-infos} : Create a new personalInfo.
     *
     * @param personalInfo the personalInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new personalInfo, or with status {@code 400 (Bad Request)} if the personalInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PersonalInfo> createPersonalInfo(@RequestBody PersonalInfo personalInfo) throws URISyntaxException {
        log.debug("REST request to save PersonalInfo : {}", personalInfo);
        if (personalInfo.getId() != null) {
            throw new BadRequestAlertException("A new personalInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        personalInfo = personalInfoRepository.save(personalInfo);
        return ResponseEntity.created(new URI("/api/personal-infos/" + personalInfo.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, personalInfo.getId().toString()))
            .body(personalInfo);
    }

    /**
     * {@code PUT  /personal-infos/:id} : Updates an existing personalInfo.
     *
     * @param id the id of the personalInfo to save.
     * @param personalInfo the personalInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personalInfo,
     * or with status {@code 400 (Bad Request)} if the personalInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the personalInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PersonalInfo> updatePersonalInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PersonalInfo personalInfo
    ) throws URISyntaxException {
        log.debug("REST request to update PersonalInfo : {}, {}", id, personalInfo);
        if (personalInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personalInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personalInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        personalInfo = personalInfoRepository.save(personalInfo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, personalInfo.getId().toString()))
            .body(personalInfo);
    }

    /**
     * {@code PATCH  /personal-infos/:id} : Partial updates given fields of an existing personalInfo, field will ignore if it is null
     *
     * @param id the id of the personalInfo to save.
     * @param personalInfo the personalInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personalInfo,
     * or with status {@code 400 (Bad Request)} if the personalInfo is not valid,
     * or with status {@code 404 (Not Found)} if the personalInfo is not found,
     * or with status {@code 500 (Internal Server Error)} if the personalInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PersonalInfo> partialUpdatePersonalInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PersonalInfo personalInfo
    ) throws URISyntaxException {
        log.debug("REST request to partial update PersonalInfo partially : {}, {}", id, personalInfo);
        if (personalInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personalInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personalInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PersonalInfo> result = personalInfoRepository
            .findById(personalInfo.getId())
            .map(existingPersonalInfo -> {
                if (personalInfo.getName() != null) {
                    existingPersonalInfo.setName(personalInfo.getName());
                }
                if (personalInfo.getGender() != null) {
                    existingPersonalInfo.setGender(personalInfo.getGender());
                }
                if (personalInfo.getBirthDate() != null) {
                    existingPersonalInfo.setBirthDate(personalInfo.getBirthDate());
                }
                if (personalInfo.getTelephone() != null) {
                    existingPersonalInfo.setTelephone(personalInfo.getTelephone());
                }
                if (personalInfo.getCreatedBy() != null) {
                    existingPersonalInfo.setCreatedBy(personalInfo.getCreatedBy());
                }
                if (personalInfo.getUpdatedBy() != null) {
                    existingPersonalInfo.setUpdatedBy(personalInfo.getUpdatedBy());
                }
                if (personalInfo.getDeletedBy() != null) {
                    existingPersonalInfo.setDeletedBy(personalInfo.getDeletedBy());
                }

                return existingPersonalInfo;
            })
            .map(personalInfoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, personalInfo.getId().toString())
        );
    }

    /**
     * {@code GET  /personal-infos} : get all the personalInfos.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of personalInfos in body.
     */
    @GetMapping("")
    public List<PersonalInfo> getAllPersonalInfos(@RequestParam(name = "filter", required = false) String filter) {
        if ("taskhistory-is-null".equals(filter)) {
            log.debug("REST request to get all PersonalInfos where taskHistory is null");
            return StreamSupport.stream(personalInfoRepository.findAll().spliterator(), false)
                .filter(personalInfo -> personalInfo.getTaskHistory() == null)
                .toList();
        }
        log.debug("REST request to get all PersonalInfos");
        return personalInfoRepository.findAll();
    }

    /**
     * {@code GET  /personal-infos/:id} : get the "id" personalInfo.
     *
     * @param id the id of the personalInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the personalInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PersonalInfo> getPersonalInfo(@PathVariable("id") Long id) {
        log.debug("REST request to get PersonalInfo : {}", id);
        Optional<PersonalInfo> personalInfo = personalInfoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(personalInfo);
    }

    /**
     * {@code DELETE  /personal-infos/:id} : delete the "id" personalInfo.
     *
     * @param id the id of the personalInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersonalInfo(@PathVariable("id") Long id) {
        log.debug("REST request to delete PersonalInfo : {}", id);
        personalInfoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
