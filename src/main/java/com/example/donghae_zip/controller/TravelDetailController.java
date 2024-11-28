package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Travel;
import com.example.donghae_zip.domain.TravelDTO;
import com.example.donghae_zip.domain.TravelDetail;
import com.example.donghae_zip.domain.TravelDetailDTO;
import com.example.donghae_zip.service.TravelDetailService;
import com.example.donghae_zip.service.TravelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/travel-detail")
public class TravelDetailController {

    private final TravelDetailService travelDetailService;
    private final TravelService travelService;

    public TravelDetailController(TravelDetailService travelDetailService, TravelService travelService) {
        this.travelDetailService = travelDetailService;
        this.travelService = travelService;
    }

    // 특정 여행 ID로 상세 일정 조회
    @GetMapping("/travel/{travelId}")
    public ResponseEntity<TravelDTO> getDetailsByTravelId(@PathVariable Long travelId) {
        Travel travel = travelService.getTravelById(travelId);
        TravelDTO travelDTO = new TravelDTO(travel); // DTO로 변환
        return ResponseEntity.ok(travelDTO); // DTO 반환
    }

    @PostMapping
    public ResponseEntity<List<TravelDetailDTO>> addTravelDetail(
            @RequestParam Long travelId,
            @RequestBody TravelDetail travelDetail
    ) {
        travelDetailService.saveTravelDetail(travelId, travelDetail);

        // 일정 추가 후, 해당 travelId의 최신 데이터 반환
        List<TravelDetail> updatedDetails = travelDetailService.getDetailsByTravelId(travelId);

        // DTO로 변환하여 반환
        List<TravelDetailDTO> updatedDetailsDTO = updatedDetails.stream()
                .map(TravelDetailDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(updatedDetailsDTO);
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
