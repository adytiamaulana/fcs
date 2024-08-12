package co.id.diti.fcs.domain;

import static co.id.diti.fcs.domain.CardTypeTestSamples.*;
import static co.id.diti.fcs.domain.PersonalInfoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import co.id.diti.fcs.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CardTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CardType.class);
        CardType cardType1 = getCardTypeSample1();
        CardType cardType2 = new CardType();
        assertThat(cardType1).isNotEqualTo(cardType2);

        cardType2.setId(cardType1.getId());
        assertThat(cardType1).isEqualTo(cardType2);

        cardType2 = getCardTypeSample2();
        assertThat(cardType1).isNotEqualTo(cardType2);
    }

    @Test
    void personalInfoTest() {
        CardType cardType = getCardTypeRandomSampleGenerator();
        PersonalInfo personalInfoBack = getPersonalInfoRandomSampleGenerator();

        cardType.setPersonalInfo(personalInfoBack);
        assertThat(cardType.getPersonalInfo()).isEqualTo(personalInfoBack);
        assertThat(personalInfoBack.getCardType()).isEqualTo(cardType);

        cardType.personalInfo(null);
        assertThat(cardType.getPersonalInfo()).isNull();
        assertThat(personalInfoBack.getCardType()).isNull();
    }
}
