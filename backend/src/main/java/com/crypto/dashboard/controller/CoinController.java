package com.crypto.dashboard.controller;

import com.crypto.dashboard.service.CoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coins")
@RequiredArgsConstructor
public class CoinController {

    private final CoinService coinService;

    @GetMapping
    public ResponseEntity<String> getCoins(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int perPage,
            @RequestParam(defaultValue = "market_cap_desc") String orderBy) {
        String result = coinService.getCoinsList(page, perPage, orderBy);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getCoinDetail(@PathVariable String id) {
        String result = coinService.getCoinDetail(id);
        return ResponseEntity.ok(result);
    }
}
