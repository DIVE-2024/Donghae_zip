package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.TravelDetail;
import com.example.donghae_zip.service.TravelDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/travel-detail")
public class TravelDetailController {

    private final TravelDetailService travelDetailService;

    public TravelDetailController(TravelDetailService travelDetailService) {
        this.travelDetailService = travelDetailService;
    }

    // 1. 특정 여행 ID로 상세 일정 조회
    @GetMapping("/travel/{travelId}")
    public ResponseEntity<List<TravelDetail>> getDetailsByTravelId(@PathVariable Long travelId) {
        List<TravelDetail> details = travelDetailService.getDetailsByTravelId(travelId);
        return ResponseEntity.ok(details);
    }

    // 2. 특정 여행에 새 일정 추가
    @PostMapping
    public ResponseEntity<TravelDetail> addTravelDetail(@RequestBody TravelDetail travelDetail) {
        TravelDetail addedDetail = travelDetailService.saveTravelDetail(travelDetail);
        return ResponseEntity.ok(addedDetail);
    }

    // 3. 특정 상세 일정 삭제
    @DeleteMapping("/{detailId}")
    public ResponseEntity<Void> deleteTravelDetail(@PathVariable Long detailId) {
        travelDetailService.deleteTravelDetail(detailId);
        return ResponseEntity.noContent().build();
    }

    // 4. 특정 상세 일정 조회
    @GetMapping("/{detailId}")
    public ResponseEntity<TravelDetail> getDetailById(@PathVariable Long detailId) {
        TravelDetail detail = travelDetailService.getTravelDetailById(detailId);
        return ResponseEntity.ok(detail);
    }
}
