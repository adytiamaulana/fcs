package co.id.diti.fcs.domain;

import static co.id.diti.fcs.domain.ApplicationStatusTestSamples.*;
import static co.id.diti.fcs.domain.TaskHistoryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import co.id.diti.fcs.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ApplicationStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ApplicationStatus.class);
        ApplicationStatus applicationStatus1 = getApplicationStatusSample1();
        ApplicationStatus applicationStatus2 = new ApplicationStatus();
        assertThat(applicationStatus1).isNotEqualTo(applicationStatus2);

        applicationStatus2.setId(applicationStatus1.getId());
        assertThat(applicationStatus1).isEqualTo(applicationStatus2);

        applicationStatus2 = getApplicationStatusSample2();
        assertThat(applicationStatus1).isNotEqualTo(applicationStatus2);
    }

    @Test
    void taskHistoryTest() {
        ApplicationStatus applicationStatus = getApplicationStatusRandomSampleGenerator();
        TaskHistory taskHistoryBack = getTaskHistoryRandomSampleGenerator();

        applicationStatus.setTaskHistory(taskHistoryBack);
        assertThat(applicationStatus.getTaskHistory()).isEqualTo(taskHistoryBack);
        assertThat(taskHistoryBack.getApplicationStatus()).isEqualTo(applicationStatus);

        applicationStatus.taskHistory(null);
        assertThat(applicationStatus.getTaskHistory()).isNull();
        assertThat(taskHistoryBack.getApplicationStatus()).isNull();
    }
}
