package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Travel;
import com.example.donghae_zip.service.TravelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    private final TravelService travelService;

    public TravelController(TravelService travelService) {
        this.travelService = travelService;
    }

    // 1. 특정 사용자 ID로 여행 목록 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Travel>> getUserTravels(@PathVariable Long userId) {
        List<Travel> travels = travelService.getUserTravels(userId);
        return ResponseEntity.ok(travels);
    }

    // 2. 새로운 여행 생성
    @PostMapping
    public ResponseEntity<Travel> createTravel(@RequestBody Travel travel) {
        Travel createdTravel = travelService.saveTravel(travel);
        return ResponseEntity.ok(createdTravel);
    }

    // 3. 특정 여행 ID로 여행 삭제
    @DeleteMapping("/{travelId}")
    public ResponseEntity<Void> deleteTravel(@PathVariable Long travelId) {
        travelService.deleteTravel(travelId);
        return ResponseEntity.noContent().build();
    }

    // 4. 특정 여행 ID로 여행 정보 조회
    @GetMapping("/{travelId}")
    public ResponseEntity<Travel> getTravelById(@PathVariable Long travelId) {
        Travel travel = travelService.getTravelById(travelId);
        return ResponseEntity.ok(travel);
    }
}
