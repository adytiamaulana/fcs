package co.id.diti.fcs.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PersonalInfoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PersonalInfo getPersonalInfoSample1() {
        return new PersonalInfo()
            .id(1L)
            .name("name1")
            .gender("gender1")
            .birthDate("birthDate1")
            .telephone("telephone1")
            .createdBy("createdBy1")
            .createdAt("createdAt1")
            .updatedBy("updatedBy1")
            .updatedAt("updatedAt1")
            .deletedBy("deletedBy1")
            .deletedAt("deletedAt1");
    }

    public static PersonalInfo getPersonalInfoSample2() {
        return new PersonalInfo()
            .id(2L)
            .name("name2")
            .gender("gender2")
            .birthDate("birthDate2")
            .telephone("telephone2")
            .createdBy("createdBy2")
            .createdAt("createdAt2")
            .updatedBy("updatedBy2")
            .updatedAt("updatedAt2")
            .deletedBy("deletedBy2")
            .deletedAt("deletedAt2");
    }

    public static PersonalInfo getPersonalInfoRandomSampleGenerator() {
        return new PersonalInfo()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .gender(UUID.randomUUID().toString())
            .birthDate(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .createdAt(UUID.randomUUID().toString())
            .updatedBy(UUID.randomUUID().toString())
            .updatedAt(UUID.randomUUID().toString())
            .deletedBy(UUID.randomUUID().toString())
            .deletedAt(UUID.randomUUID().toString());
    }
}
