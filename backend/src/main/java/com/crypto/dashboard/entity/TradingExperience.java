package com.crypto.dashboard.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TradingExperience {
    LESS_THAN_1("less-than-1"),
    ONE_TO_TWO("1-2"),
    THREE_TO_FIVE("3-5"),
    FIVE_TO_TEN("5-10"),
    MORE_THAN_10("more-than-10");

    private final String value;

    TradingExperience(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TradingExperience fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        for (TradingExperience experience : values()) {
            if (experience.value.equals(value)) {
                return experience;
            }
        }

        throw new IllegalArgumentException("Unknown tradingExperience: " + value);
    }
}
