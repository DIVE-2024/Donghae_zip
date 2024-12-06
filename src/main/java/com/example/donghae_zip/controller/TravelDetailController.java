package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Travel;
import com.example.donghae_zip.domain.TravelDTO;
import com.example.donghae_zip.domain.TravelDetail;
import com.example.donghae_zip.domain.TravelDetailDTO;
import com.example.donghae_zip.service.TravelDetailService;
import com.example.donghae_zip.service.TravelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/travel/{travelId}")
    public ResponseEntity<TravelDTO> getDetailsByTravelId(@PathVariable Long travelId) {
        Travel travel = travelService.getTravelById(travelId);
        TravelDTO travelDTO = new TravelDTO(travel);

        // TravelDetailDTO 생성 시 placeType 포함
        List<TravelDetailDTO> updatedDetails = travelDTO.getTravelDetails().stream()
                .map(detail -> {
                    String placeTitle = travelDetailService.getPlaceTitle(detail.getPlaceType(), detail.getPlaceId());
                    return new TravelDetailDTO(
                            detail.getDetailId(),
                            detail.getPlaceType(), // placeType 올바르게 전달
                            detail.getTravelDate(),
                            detail.getPlaceId(),
                            detail.getStartTime(),
                            detail.getEndTime(),
                            placeTitle
                    );
                })
                .collect(Collectors.toList());

        travelDTO.setTravelDetails(updatedDetails); // 업데이트된 TravelDetails 설정
        return ResponseEntity.ok(travelDTO);
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

    // 특정 날짜의 일정 조회 API
    @GetMapping("/travel/{travelId}/date/{travelDate}")
    public ResponseEntity<List<TravelDetailDTO>> getDetailsByTravelDate(
            @PathVariable Long travelId,
            @PathVariable String travelDate) {
        List<TravelDetail> travelDetails = travelDetailService.getDetailsByTravelDate(travelId, travelDate);

        List<TravelDetailDTO> travelDetailDTOs = travelDetails.stream()
                .map(detail -> {
                    String placeTitle = travelDetailService.getPlaceTitle(detail.getPlaceType(), detail.getPlaceId());
                    return new TravelDetailDTO(
                            detail.getDetailId(),
                            detail.getPlaceType(),
                            detail.getTravelDate(),
                            detail.getPlaceId(),
                            detail.getStartTime(),
                            detail.getEndTime(),
                            placeTitle
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(travelDetailDTOs);
    }

    // 특정 날짜의 일정 저장 API
    @PostMapping("/travel/{travelId}/date/{travelDate}")
    public ResponseEntity<TravelDetailDTO> addDetailForDate(
            @PathVariable Long travelId,
            @PathVariable String travelDate,
            @RequestBody TravelDetail travelDetail) {

        travelDetail.setTravelDate(LocalDate.parse(travelDate)); // travelDate 설정
        TravelDetail savedDetail = travelDetailService.saveTravelDetail(travelId, travelDetail);

        String placeTitle = travelDetailService.getPlaceTitle(savedDetail.getPlaceType(), savedDetail.getPlaceId());
        TravelDetailDTO travelDetailDTO = new TravelDetailDTO(
                savedDetail.getDetailId(),
                savedDetail.getPlaceType(),
                savedDetail.getTravelDate(),
                savedDetail.getPlaceId(),
                savedDetail.getStartTime(),
                savedDetail.getEndTime(),
                placeTitle
        );

        return ResponseEntity.ok(travelDetailDTO);
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
