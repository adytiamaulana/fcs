package co.id.diti.fcs.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link co.id.diti.fcs.domain.TaskHistory} entity. This class is used
 * in {@link co.id.diti.fcs.web.rest.TaskHistoryResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /task-histories?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TaskHistoryCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter branch;

    private LocalDateFilter startDate;

    private LocalDateFilter endDate;

    private LongFilter personalInfoId;

    private LongFilter applicationStatusId;

    private Boolean distinct;

    public TaskHistoryCriteria() {}

    public TaskHistoryCriteria(TaskHistoryCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.branch = other.optionalBranch().map(StringFilter::copy).orElse(null);
        this.startDate = other.optionalStartDate().map(LocalDateFilter::copy).orElse(null);
        this.endDate = other.optionalEndDate().map(LocalDateFilter::copy).orElse(null);
        this.personalInfoId = other.optionalPersonalInfoId().map(LongFilter::copy).orElse(null);
        this.applicationStatusId = other.optionalApplicationStatusId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public TaskHistoryCriteria copy() {
        return new TaskHistoryCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getBranch() {
        return branch;
    }

    public Optional<StringFilter> optionalBranch() {
        return Optional.ofNullable(branch);
    }

    public StringFilter branch() {
        if (branch == null) {
            setBranch(new StringFilter());
        }
        return branch;
    }

    public void setBranch(StringFilter branch) {
        this.branch = branch;
    }

    public LocalDateFilter getStartDate() {
        return startDate;
    }

    public Optional<LocalDateFilter> optionalStartDate() {
        return Optional.ofNullable(startDate);
    }

    public LocalDateFilter startDate() {
        if (startDate == null) {
            setStartDate(new LocalDateFilter());
        }
        return startDate;
    }

    public void setStartDate(LocalDateFilter startDate) {
        this.startDate = startDate;
    }

    public LocalDateFilter getEndDate() {
        return endDate;
    }

    public Optional<LocalDateFilter> optionalEndDate() {
        return Optional.ofNullable(endDate);
    }

    public LocalDateFilter endDate() {
        if (endDate == null) {
            setEndDate(new LocalDateFilter());
        }
        return endDate;
    }

    public void setEndDate(LocalDateFilter endDate) {
        this.endDate = endDate;
    }

    public LongFilter getPersonalInfoId() {
        return personalInfoId;
    }

    public Optional<LongFilter> optionalPersonalInfoId() {
        return Optional.ofNullable(personalInfoId);
    }

    public LongFilter personalInfoId() {
        if (personalInfoId == null) {
            setPersonalInfoId(new LongFilter());
        }
        return personalInfoId;
    }

    public void setPersonalInfoId(LongFilter personalInfoId) {
        this.personalInfoId = personalInfoId;
    }

    public LongFilter getApplicationStatusId() {
        return applicationStatusId;
    }

    public Optional<LongFilter> optionalApplicationStatusId() {
        return Optional.ofNullable(applicationStatusId);
    }

    public LongFilter applicationStatusId() {
        if (applicationStatusId == null) {
            setApplicationStatusId(new LongFilter());
        }
        return applicationStatusId;
    }

    public void setApplicationStatusId(LongFilter applicationStatusId) {
        this.applicationStatusId = applicationStatusId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TaskHistoryCriteria that = (TaskHistoryCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(branch, that.branch) &&
            Objects.equals(startDate, that.startDate) &&
            Objects.equals(endDate, that.endDate) &&
            Objects.equals(personalInfoId, that.personalInfoId) &&
            Objects.equals(applicationStatusId, that.applicationStatusId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, branch, startDate, endDate, personalInfoId, applicationStatusId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TaskHistoryCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalBranch().map(f -> "branch=" + f + ", ").orElse("") +
            optionalStartDate().map(f -> "startDate=" + f + ", ").orElse("") +
            optionalEndDate().map(f -> "endDate=" + f + ", ").orElse("") +
            optionalPersonalInfoId().map(f -> "personalInfoId=" + f + ", ").orElse("") +
            optionalApplicationStatusId().map(f -> "applicationStatusId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
