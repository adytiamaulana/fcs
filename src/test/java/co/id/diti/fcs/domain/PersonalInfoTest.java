package co.id.diti.fcs.domain;

import static co.id.diti.fcs.domain.AddressTestSamples.*;
import static co.id.diti.fcs.domain.CardTypeTestSamples.*;
import static co.id.diti.fcs.domain.PersonalInfoTestSamples.*;
import static co.id.diti.fcs.domain.TaskHistoryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import co.id.diti.fcs.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PersonalInfoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PersonalInfo.class);
        PersonalInfo personalInfo1 = getPersonalInfoSample1();
        PersonalInfo personalInfo2 = new PersonalInfo();
        assertThat(personalInfo1).isNotEqualTo(personalInfo2);

        personalInfo2.setId(personalInfo1.getId());
        assertThat(personalInfo1).isEqualTo(personalInfo2);

        personalInfo2 = getPersonalInfoSample2();
        assertThat(personalInfo1).isNotEqualTo(personalInfo2);
    }

    @Test
    void addressTest() {
        PersonalInfo personalInfo = getPersonalInfoRandomSampleGenerator();
        Address addressBack = getAddressRandomSampleGenerator();

        personalInfo.setAddress(addressBack);
        assertThat(personalInfo.getAddress()).isEqualTo(addressBack);

        personalInfo.address(null);
        assertThat(personalInfo.getAddress()).isNull();
    }

    @Test
    void cardTypeTest() {
        PersonalInfo personalInfo = getPersonalInfoRandomSampleGenerator();
        CardType cardTypeBack = getCardTypeRandomSampleGenerator();

        personalInfo.setCardType(cardTypeBack);
        assertThat(personalInfo.getCardType()).isEqualTo(cardTypeBack);

        personalInfo.cardType(null);
        assertThat(personalInfo.getCardType()).isNull();
    }

    @Test
    void taskHistoryTest() {
        PersonalInfo personalInfo = getPersonalInfoRandomSampleGenerator();
        TaskHistory taskHistoryBack = getTaskHistoryRandomSampleGenerator();

        personalInfo.setTaskHistory(taskHistoryBack);
        assertThat(personalInfo.getTaskHistory()).isEqualTo(taskHistoryBack);
        assertThat(taskHistoryBack.getPersonalInfo()).isEqualTo(personalInfo);

        personalInfo.taskHistory(null);
        assertThat(personalInfo.getTaskHistory()).isNull();
        assertThat(taskHistoryBack.getPersonalInfo()).isNull();
    }
}
