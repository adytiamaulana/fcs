package co.id.diti.fcs.domain;

import static co.id.diti.fcs.domain.AddressTestSamples.*;
import static co.id.diti.fcs.domain.PersonalInfoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import co.id.diti.fcs.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AddressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Address.class);
        Address address1 = getAddressSample1();
        Address address2 = new Address();
        assertThat(address1).isNotEqualTo(address2);

        address2.setId(address1.getId());
        assertThat(address1).isEqualTo(address2);

        address2 = getAddressSample2();
        assertThat(address1).isNotEqualTo(address2);
    }

    @Test
    void personalInfoTest() {
        Address address = getAddressRandomSampleGenerator();
        PersonalInfo personalInfoBack = getPersonalInfoRandomSampleGenerator();

        address.setPersonalInfo(personalInfoBack);
        assertThat(address.getPersonalInfo()).isEqualTo(personalInfoBack);
        assertThat(personalInfoBack.getAddress()).isEqualTo(address);

        address.personalInfo(null);
        assertThat(address.getPersonalInfo()).isNull();
        assertThat(personalInfoBack.getAddress()).isNull();
    }
}
