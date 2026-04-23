package com.crypto.dashboard.dto.request;

import com.crypto.dashboard.entity.TradingExperience;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private TradingExperience tradingExperience;
}
