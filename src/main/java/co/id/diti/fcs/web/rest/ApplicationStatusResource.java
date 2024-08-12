package co.id.diti.fcs.web.rest;

import co.id.diti.fcs.domain.ApplicationStatus;
import co.id.diti.fcs.repository.ApplicationStatusRepository;
import co.id.diti.fcs.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
 * REST controller for managing {@link co.id.diti.fcs.domain.ApplicationStatus}.
 */
@RestController
@RequestMapping("/api/application-statuses")
@Transactional
public class ApplicationStatusResource {

    private static final Logger log = LoggerFactory.getLogger(ApplicationStatusResource.class);

    private static final String ENTITY_NAME = "applicationStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ApplicationStatusRepository applicationStatusRepository;

    public ApplicationStatusResource(ApplicationStatusRepository applicationStatusRepository) {
        this.applicationStatusRepository = applicationStatusRepository;
    }

    /**
     * {@code POST  /application-statuses} : Create a new applicationStatus.
     *
     * @param applicationStatus the applicationStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new applicationStatus, or with status {@code 400 (Bad Request)} if the applicationStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ApplicationStatus> createApplicationStatus(@Valid @RequestBody ApplicationStatus applicationStatus)
        throws URISyntaxException {
        log.debug("REST request to save ApplicationStatus : {}", applicationStatus);
        if (applicationStatus.getId() != null) {
            throw new BadRequestAlertException("A new applicationStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        applicationStatus = applicationStatusRepository.save(applicationStatus);
        return ResponseEntity.created(new URI("/api/application-statuses/" + applicationStatus.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, applicationStatus.getId().toString()))
            .body(applicationStatus);
    }

    /**
     * {@code PUT  /application-statuses/:id} : Updates an existing applicationStatus.
     *
     * @param id the id of the applicationStatus to save.
     * @param applicationStatus the applicationStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated applicationStatus,
     * or with status {@code 400 (Bad Request)} if the applicationStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the applicationStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationStatus> updateApplicationStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ApplicationStatus applicationStatus
    ) throws URISyntaxException {
        log.debug("REST request to update ApplicationStatus : {}, {}", id, applicationStatus);
        if (applicationStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, applicationStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!applicationStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        applicationStatus = applicationStatusRepository.save(applicationStatus);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, applicationStatus.getId().toString()))
            .body(applicationStatus);
    }

    /**
     * {@code PATCH  /application-statuses/:id} : Partial updates given fields of an existing applicationStatus, field will ignore if it is null
     *
     * @param id the id of the applicationStatus to save.
     * @param applicationStatus the applicationStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated applicationStatus,
     * or with status {@code 400 (Bad Request)} if the applicationStatus is not valid,
     * or with status {@code 404 (Not Found)} if the applicationStatus is not found,
     * or with status {@code 500 (Internal Server Error)} if the applicationStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ApplicationStatus> partialUpdateApplicationStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ApplicationStatus applicationStatus
    ) throws URISyntaxException {
        log.debug("REST request to partial update ApplicationStatus partially : {}, {}", id, applicationStatus);
        if (applicationStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, applicationStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!applicationStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ApplicationStatus> result = applicationStatusRepository
            .findById(applicationStatus.getId())
            .map(existingApplicationStatus -> {
                if (applicationStatus.getCode() != null) {
                    existingApplicationStatus.setCode(applicationStatus.getCode());
                }
                if (applicationStatus.getStatus() != null) {
                    existingApplicationStatus.setStatus(applicationStatus.getStatus());
                }
                if (applicationStatus.getCreatedBy() != null) {
                    existingApplicationStatus.setCreatedBy(applicationStatus.getCreatedBy());
                }
                if (applicationStatus.getCreatedAt() != null) {
                    existingApplicationStatus.setCreatedAt(applicationStatus.getCreatedAt());
                }
                if (applicationStatus.getUpdatedBy() != null) {
                    existingApplicationStatus.setUpdatedBy(applicationStatus.getUpdatedBy());
                }
                if (applicationStatus.getUpdatedAt() != null) {
                    existingApplicationStatus.setUpdatedAt(applicationStatus.getUpdatedAt());
                }
                if (applicationStatus.getDeletedBy() != null) {
                    existingApplicationStatus.setDeletedBy(applicationStatus.getDeletedBy());
                }
                if (applicationStatus.getDeletedAt() != null) {
                    existingApplicationStatus.setDeletedAt(applicationStatus.getDeletedAt());
                }

                return existingApplicationStatus;
            })
            .map(applicationStatusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, applicationStatus.getId().toString())
        );
    }

    /**
     * {@code GET  /application-statuses} : get all the applicationStatuses.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of applicationStatuses in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ApplicationStatus>> getAllApplicationStatuses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("taskhistory-is-null".equals(filter)) {
            log.debug("REST request to get all ApplicationStatuss where taskHistory is null");
            return new ResponseEntity<>(
                StreamSupport.stream(applicationStatusRepository.findAll().spliterator(), false)
                    .filter(applicationStatus -> applicationStatus.getTaskHistory() == null)
                    .toList(),
                HttpStatus.OK
            );
        }
        log.debug("REST request to get a page of ApplicationStatuses");
        Page<ApplicationStatus> page = applicationStatusRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /application-statuses/:id} : get the "id" applicationStatus.
     *
     * @param id the id of the applicationStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the applicationStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationStatus> getApplicationStatus(@PathVariable("id") Long id) {
        log.debug("REST request to get ApplicationStatus : {}", id);
        Optional<ApplicationStatus> applicationStatus = applicationStatusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(applicationStatus);
    }

    /**
     * {@code DELETE  /application-statuses/:id} : delete the "id" applicationStatus.
     *
     * @param id the id of the applicationStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplicationStatus(@PathVariable("id") Long id) {
        log.debug("REST request to delete ApplicationStatus : {}", id);
        applicationStatusRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
