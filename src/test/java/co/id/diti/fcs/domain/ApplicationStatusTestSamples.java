package co.id.diti.fcs.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ApplicationStatusTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ApplicationStatus getApplicationStatusSample1() {
        return new ApplicationStatus()
            .id(1L)
            .code("code1")
            .status("status1")
            .createdBy("createdBy1")
            .createdAt("createdAt1")
            .updatedBy("updatedBy1")
            .updatedAt("updatedAt1")
            .deletedBy("deletedBy1")
            .deletedAt("deletedAt1");
    }

    public static ApplicationStatus getApplicationStatusSample2() {
        return new ApplicationStatus()
            .id(2L)
            .code("code2")
            .status("status2")
            .createdBy("createdBy2")
            .createdAt("createdAt2")
            .updatedBy("updatedBy2")
            .updatedAt("updatedAt2")
            .deletedBy("deletedBy2")
            .deletedAt("deletedAt2");
    }

    public static ApplicationStatus getApplicationStatusRandomSampleGenerator() {
        return new ApplicationStatus()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .createdAt(UUID.randomUUID().toString())
            .updatedBy(UUID.randomUUID().toString())
            .updatedAt(UUID.randomUUID().toString())
            .deletedBy(UUID.randomUUID().toString())
            .deletedAt(UUID.randomUUID().toString());
    }
}
