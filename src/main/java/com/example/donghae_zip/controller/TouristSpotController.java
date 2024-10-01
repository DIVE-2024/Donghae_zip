package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.TouristSpot;
import com.example.donghae_zip.service.TouristSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/tourist-spots")
@Tag(name = "Tourist Spots", description = "여행지 관련 API")
public class TouristSpotController {

    @Autowired
    private TouristSpotService touristSpotService;

    @Operation(summary = "여행지 ID로 조회", description = "ID를 통해 특정 여행지 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<TouristSpot> getTouristSpotById(
            @Parameter(description = "여행지의 ID", required = true) @PathVariable Long id) {
        TouristSpot touristSpot = touristSpotService.getTouristSpotById(id);
        return ResponseEntity.ok(touristSpot);
    }

    @Operation(summary = "실내 여행지 목록 조회", description = "실내 여행지 정보를 페이지네이션으로 제공합니다.")
    @GetMapping("/indoor")
    public ResponseEntity<Page<TouristSpot>> getIndoorSpots(
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Page<TouristSpot> spots = touristSpotService.getIndoorSpots(page, size);
        return ResponseEntity.ok(spots);
    }

    @Operation(summary = "실외 여행지 목록 조회", description = "실외 여행지 정보를 페이지네이션으로 제공합니다.")
    @GetMapping("/outdoor")
    public ResponseEntity<Page<TouristSpot>> getOutdoorSpots(
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Page<TouristSpot> spots = touristSpotService.getOutdoorSpots(page, size);
        return ResponseEntity.ok(spots);
    }

    @Operation(summary = "특정 카테고리의 여행지 조회", description = "카테고리로 여행지를 필터링하여 페이지네이션으로 제공합니다.")
    @GetMapping("/category")
    public ResponseEntity<Page<TouristSpot>> getSpotsByCategory(
            @Parameter(description = "필터링할 카테고리", required = true) @RequestParam String category,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Page<TouristSpot> spots = touristSpotService.getSpotsByCategories(List.of(category), page, size);
        return ResponseEntity.ok(spots);
    }

    @Operation(summary = "제목으로 여행지 검색", description = "제목을 포함하는 여행지를 페이지네이션으로 검색합니다.")
    @GetMapping("/search/title")
    public ResponseEntity<Page<TouristSpot>> searchByTitle(
            @Parameter(description = "검색할 여행지 제목", required = true) @RequestParam String title,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Page<TouristSpot> spots = touristSpotService.searchByTitle(title, PageRequest.of(page, size));
        return ResponseEntity.ok(spots);
    }

    @Operation(summary = "지역으로 여행지 검색", description = "지역명을 통해 여행지를 페이지네이션으로 검색합니다.")
    @GetMapping("/search/region")
    public ResponseEntity<Page<TouristSpot>> searchByRegion(
            @Parameter(description = "검색할 지역", required = true) @RequestParam String region,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Page<TouristSpot> spots = touristSpotService.searchByRegion(region, PageRequest.of(page, size));
        return ResponseEntity.ok(spots);
    }

    @Operation(summary = "다중 조건으로 여행지 검색", description = "제목, 카테고리, 지역, 태그를 기준으로 여행지를 페이지네이션으로 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<Page<TouristSpot>> searchByMultipleCriteria(
            @Parameter(description = "검색할 제목") @RequestParam(required = false) String title,
            @Parameter(description = "검색할 카테고리") @RequestParam(required = false) String category,
            @Parameter(description = "검색할 지역") @RequestParam(required = false) String region,
            @Parameter(description = "검색할 태그") @RequestParam(required = false) String tag,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TouristSpot> spots = touristSpotService.searchSpots(title, category, region, tag, pageable);
        return ResponseEntity.ok(spots);
    }
}