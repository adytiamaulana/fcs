package co.id.diti.fcs.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CardTypeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static CardType getCardTypeSample1() {
        return new CardType()
            .id(1L)
            .cardCode(1)
            .cardName("cardName1")
            .createdBy("createdBy1")
            .updatedBy("updatedBy1")
            .deletedBy("deletedBy1");
    }

    public static CardType getCardTypeSample2() {
        return new CardType()
            .id(2L)
            .cardCode(2)
            .cardName("cardName2")
            .createdBy("createdBy2")
            .updatedBy("updatedBy2")
            .deletedBy("deletedBy2");
    }

    public static CardType getCardTypeRandomSampleGenerator() {
        return new CardType()
            .id(longCount.incrementAndGet())
            .cardCode(intCount.incrementAndGet())
            .cardName(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .updatedBy(UUID.randomUUID().toString())
            .deletedBy(UUID.randomUUID().toString());
    }
}
