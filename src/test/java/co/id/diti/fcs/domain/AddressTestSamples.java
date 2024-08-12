package co.id.diti.fcs.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AddressTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Address getAddressSample1() {
        return new Address()
            .id(1L)
            .address("address1")
            .country("country1")
            .province("province1")
            .city("city1")
            .district("district1")
            .village("village1")
            .postalCode(1)
            .telephone("telephone1")
            .createdBy("createdBy1")
            .updatedBy("updatedBy1")
            .deletedBy("deletedBy1");
    }

    public static Address getAddressSample2() {
        return new Address()
            .id(2L)
            .address("address2")
            .country("country2")
            .province("province2")
            .city("city2")
            .district("district2")
            .village("village2")
            .postalCode(2)
            .telephone("telephone2")
            .createdBy("createdBy2")
            .updatedBy("updatedBy2")
            .deletedBy("deletedBy2");
    }

    public static Address getAddressRandomSampleGenerator() {
        return new Address()
            .id(longCount.incrementAndGet())
            .address(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .province(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .district(UUID.randomUUID().toString())
            .village(UUID.randomUUID().toString())
            .postalCode(intCount.incrementAndGet())
            .telephone(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .updatedBy(UUID.randomUUID().toString())
            .deletedBy(UUID.randomUUID().toString());
    }
}
