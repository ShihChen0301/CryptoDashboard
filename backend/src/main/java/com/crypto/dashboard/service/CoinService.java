package com.crypto.dashboard.service;

import com.crypto.dashboard.exception.ExternalApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class CoinService {

    private final RestTemplate restTemplate;

    @Value("${coingecko.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.coingecko.com/api/v3";

    @Cacheable(value = "coinsList", key = "#page + '-' + #perPage + '-' + #orderBy")
    public String getCoinsList(int page, int perPage, String orderBy) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/coins/markets")
                .queryParam("vs_currency", "usd")
                .queryParam("order", orderBy)
                .queryParam("per_page", perPage)
                .queryParam("page", page)
                .queryParam("sparkline", false)
                .queryParam("x_cg_demo_api_key", apiKey)
                .toUriString();

        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            throw new ExternalApiException("Failed to fetch coins list from CoinGecko", e);
        }
    }

    @Cacheable(value = "coinDetail", key = "#coinId")
    public String getCoinDetail(String coinId) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/coins/" + coinId)
                .queryParam("localization", false)
                .queryParam("tickers", false)
                .queryParam("community_data", false)
                .queryParam("developer_data", false)
                .queryParam("x_cg_demo_api_key", apiKey)
                .toUriString();

        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            throw new ExternalApiException("Failed to fetch coin detail from CoinGecko", e);
        }
    }
}
