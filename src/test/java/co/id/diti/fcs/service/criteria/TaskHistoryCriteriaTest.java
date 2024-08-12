package co.id.diti.fcs.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class TaskHistoryCriteriaTest {

    @Test
    void newTaskHistoryCriteriaHasAllFiltersNullTest() {
        var taskHistoryCriteria = new TaskHistoryCriteria();
        assertThat(taskHistoryCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void taskHistoryCriteriaFluentMethodsCreatesFiltersTest() {
        var taskHistoryCriteria = new TaskHistoryCriteria();

        setAllFilters(taskHistoryCriteria);

        assertThat(taskHistoryCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void taskHistoryCriteriaCopyCreatesNullFilterTest() {
        var taskHistoryCriteria = new TaskHistoryCriteria();
        var copy = taskHistoryCriteria.copy();

        assertThat(taskHistoryCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(taskHistoryCriteria)
        );
    }

    @Test
    void taskHistoryCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var taskHistoryCriteria = new TaskHistoryCriteria();
        setAllFilters(taskHistoryCriteria);

        var copy = taskHistoryCriteria.copy();

        assertThat(taskHistoryCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(taskHistoryCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var taskHistoryCriteria = new TaskHistoryCriteria();

        assertThat(taskHistoryCriteria).hasToString("TaskHistoryCriteria{}");
    }

    private static void setAllFilters(TaskHistoryCriteria taskHistoryCriteria) {
        taskHistoryCriteria.id();
        taskHistoryCriteria.branch();
        taskHistoryCriteria.startDate();
        taskHistoryCriteria.endDate();
        taskHistoryCriteria.personalInfoId();
        taskHistoryCriteria.applicationStatusId();
        taskHistoryCriteria.distinct();
    }

    private static Condition<TaskHistoryCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getBranch()) &&
                condition.apply(criteria.getStartDate()) &&
                condition.apply(criteria.getEndDate()) &&
                condition.apply(criteria.getPersonalInfoId()) &&
                condition.apply(criteria.getApplicationStatusId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<TaskHistoryCriteria> copyFiltersAre(TaskHistoryCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getBranch(), copy.getBranch()) &&
                condition.apply(criteria.getStartDate(), copy.getStartDate()) &&
                condition.apply(criteria.getEndDate(), copy.getEndDate()) &&
                condition.apply(criteria.getPersonalInfoId(), copy.getPersonalInfoId()) &&
                condition.apply(criteria.getApplicationStatusId(), copy.getApplicationStatusId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
