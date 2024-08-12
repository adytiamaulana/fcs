package co.id.diti.fcs.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A ApplicationStatus.
 */
@Entity
@Table(name = "application_status")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApplicationStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "status")
    private String status;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "deleted_by")
    private String deletedBy;

    @JsonIgnoreProperties(value = { "personalInfo", "applicationStatus" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "applicationStatus")
    private TaskHistory taskHistory;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApplicationStatus id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public ApplicationStatus code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStatus() {
        return this.status;
    }

    public ApplicationStatus status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public ApplicationStatus createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return this.updatedBy;
    }

    public ApplicationStatus updatedBy(String updatedBy) {
        this.setUpdatedBy(updatedBy);
        return this;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getDeletedBy() {
        return this.deletedBy;
    }

    public ApplicationStatus deletedBy(String deletedBy) {
        this.setDeletedBy(deletedBy);
        return this;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public TaskHistory getTaskHistory() {
        return this.taskHistory;
    }

    public void setTaskHistory(TaskHistory taskHistory) {
        if (this.taskHistory != null) {
            this.taskHistory.setApplicationStatus(null);
        }
        if (taskHistory != null) {
            taskHistory.setApplicationStatus(this);
        }
        this.taskHistory = taskHistory;
    }

    public ApplicationStatus taskHistory(TaskHistory taskHistory) {
        this.setTaskHistory(taskHistory);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationStatus)) {
            return false;
        }
        return getId() != null && getId().equals(((ApplicationStatus) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationStatus{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", updatedBy='" + getUpdatedBy() + "'" +
            ", deletedBy='" + getDeletedBy() + "'" +
            "}";
    }
}
