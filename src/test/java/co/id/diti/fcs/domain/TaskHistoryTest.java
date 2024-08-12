package co.id.diti.fcs.domain;

import static co.id.diti.fcs.domain.ApplicationStatusTestSamples.*;
import static co.id.diti.fcs.domain.PersonalInfoTestSamples.*;
import static co.id.diti.fcs.domain.TaskHistoryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import co.id.diti.fcs.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TaskHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TaskHistory.class);
        TaskHistory taskHistory1 = getTaskHistorySample1();
        TaskHistory taskHistory2 = new TaskHistory();
        assertThat(taskHistory1).isNotEqualTo(taskHistory2);

        taskHistory2.setId(taskHistory1.getId());
        assertThat(taskHistory1).isEqualTo(taskHistory2);

        taskHistory2 = getTaskHistorySample2();
        assertThat(taskHistory1).isNotEqualTo(taskHistory2);
    }

    @Test
    void personalInfoTest() {
        TaskHistory taskHistory = getTaskHistoryRandomSampleGenerator();
        PersonalInfo personalInfoBack = getPersonalInfoRandomSampleGenerator();

        taskHistory.setPersonalInfo(personalInfoBack);
        assertThat(taskHistory.getPersonalInfo()).isEqualTo(personalInfoBack);

        taskHistory.personalInfo(null);
        assertThat(taskHistory.getPersonalInfo()).isNull();
    }

    @Test
    void applicationStatusTest() {
        TaskHistory taskHistory = getTaskHistoryRandomSampleGenerator();
        ApplicationStatus applicationStatusBack = getApplicationStatusRandomSampleGenerator();

        taskHistory.setApplicationStatus(applicationStatusBack);
        assertThat(taskHistory.getApplicationStatus()).isEqualTo(applicationStatusBack);

        taskHistory.applicationStatus(null);
        assertThat(taskHistory.getApplicationStatus()).isNull();
    }
}
