package co.id.diti.fcs.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A CardType.
 */
@Entity
@Table(name = "card_type")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CardType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "card_code")
    private Integer cardCode;

    @Column(name = "card_name")
    private String cardName;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at")
    private String updatedAt;

    @Column(name = "deleted_by")
    private String deletedBy;

    @Column(name = "deleted_at")
    private String deletedAt;

    @JsonIgnoreProperties(value = { "address", "cardType", "taskHistory" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "cardType")
    private PersonalInfo personalInfo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CardType id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCardCode() {
        return this.cardCode;
    }

    public CardType cardCode(Integer cardCode) {
        this.setCardCode(cardCode);
        return this;
    }

    public void setCardCode(Integer cardCode) {
        this.cardCode = cardCode;
    }

    public String getCardName() {
        return this.cardName;
    }

    public CardType cardName(String cardName) {
        this.setCardName(cardName);
        return this;
    }

    public void setCardName(String cardName) {
        this.cardName = cardName;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public CardType createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public CardType createdAt(String createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedBy() {
        return this.updatedBy;
    }

    public CardType updatedBy(String updatedBy) {
        this.setUpdatedBy(updatedBy);
        return this;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public CardType updatedAt(String updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getDeletedBy() {
        return this.deletedBy;
    }

    public CardType deletedBy(String deletedBy) {
        this.setDeletedBy(deletedBy);
        return this;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public String getDeletedAt() {
        return this.deletedAt;
    }

    public CardType deletedAt(String deletedAt) {
        this.setDeletedAt(deletedAt);
        return this;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }

    public PersonalInfo getPersonalInfo() {
        return this.personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        if (this.personalInfo != null) {
            this.personalInfo.setCardType(null);
        }
        if (personalInfo != null) {
            personalInfo.setCardType(this);
        }
        this.personalInfo = personalInfo;
    }

    public CardType personalInfo(PersonalInfo personalInfo) {
        this.setPersonalInfo(personalInfo);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CardType)) {
            return false;
        }
        return getId() != null && getId().equals(((CardType) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CardType{" +
            "id=" + getId() +
            ", cardCode=" + getCardCode() +
            ", cardName='" + getCardName() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedBy='" + getUpdatedBy() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", deletedBy='" + getDeletedBy() + "'" +
            ", deletedAt='" + getDeletedAt() + "'" +
            "}";
    }
}
