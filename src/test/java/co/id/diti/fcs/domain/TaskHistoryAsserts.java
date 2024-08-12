package co.id.diti.fcs.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class TaskHistoryAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertTaskHistoryAllPropertiesEquals(TaskHistory expected, TaskHistory actual) {
        assertTaskHistoryAutoGeneratedPropertiesEquals(expected, actual);
        assertTaskHistoryAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertTaskHistoryAllUpdatablePropertiesEquals(TaskHistory expected, TaskHistory actual) {
        assertTaskHistoryUpdatableFieldsEquals(expected, actual);
        assertTaskHistoryUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertTaskHistoryAutoGeneratedPropertiesEquals(TaskHistory expected, TaskHistory actual) {
        assertThat(expected)
            .as("Verify TaskHistory auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertTaskHistoryUpdatableFieldsEquals(TaskHistory expected, TaskHistory actual) {
        assertThat(expected)
            .as("Verify TaskHistory relevant properties")
            .satisfies(e -> assertThat(e.getBranch()).as("check branch").isEqualTo(actual.getBranch()))
            .satisfies(e -> assertThat(e.getStartDate()).as("check startDate").isEqualTo(actual.getStartDate()))
            .satisfies(e -> assertThat(e.getEndDate()).as("check endDate").isEqualTo(actual.getEndDate()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertTaskHistoryUpdatableRelationshipsEquals(TaskHistory expected, TaskHistory actual) {
        assertThat(expected)
            .as("Verify TaskHistory relationships")
            .satisfies(e -> assertThat(e.getPersonalInfo()).as("check personalInfo").isEqualTo(actual.getPersonalInfo()))
            .satisfies(e -> assertThat(e.getApplicationStatus()).as("check applicationStatus").isEqualTo(actual.getApplicationStatus()));
    }
}