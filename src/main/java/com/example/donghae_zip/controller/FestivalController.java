package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Festival;
import com.example.donghae_zip.domain.FestivalStatus;
import com.example.donghae_zip.repository.FestivalRepository;
import com.example.donghae_zip.service.FestivalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/festivals")
@Tag(name = "Festivals", description = "축제 관련 API")
public class FestivalController {

    @Autowired
    private FestivalService festivalService;

    @Autowired
    private FestivalRepository festivalRepository;  // 주입된 festivalRepository

    // ID로 축제 조회
    @Operation(summary = "ID로 축제 조회", description = "ID를 통해 특정 축제 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<Festival> getFestivalById(
            @Parameter(description = "축제의 ID", required = true) @PathVariable Long id) {
        Festival festival = festivalService.getFestivalById(id);
        return ResponseEntity.ok(festival);
    }

    // 제목으로 축제 검색 (페이지네이션 적용)
    @Operation(summary = "제목으로 축제 검색", description = "제목을 포함하는 축제를 페이지네이션으로 검색합니다.")
    @GetMapping("/search/title")
    public ResponseEntity<Page<Festival>> searchFestivalsByTitle(
            @Parameter(description = "검색할 축제 제목", required = true) @RequestParam String title,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Page<Festival> festivals = festivalService.searchFestivalsByTitle(title, page, size);
        return ResponseEntity.ok(festivals);
    }

    // 년/월별로 축제 조회 (2024년 12월 등)
    @Operation(summary = "년/월별로 축제 조회", description = "년/월을 기준으로 축제를 검색합니다 (예: 2024년 12월).")
    @GetMapping("/search/year-month")
    public ResponseEntity<List<Festival>> searchFestivalsByYearAndMonth(
            @Parameter(description = "검색할 년도", required = true) @RequestParam int year,
            @Parameter(description = "검색할 월", required = true) @RequestParam int month) {

        List<Festival> festivals = festivalService.searchFestivalsByYearAndMonth(year, month);
        return ResponseEntity.ok(festivals);
    }

    @Operation(summary = "지역별로 축제 조회", description = "지역명을 통해 축제를 페이지네이션으로 검색합니다.")
    @GetMapping("/search/region")
    public ResponseEntity<Page<Festival>> searchFestivalsByRegion(
            @Parameter(description = "검색할 지역", required = true) @RequestParam String region,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        Page<Festival> festivals = festivalService.searchFestivalsByRegion(region, page, size);
        return ResponseEntity.ok(festivals);
    }

    @Operation(summary = "상태별로 축제 조회", description = "축제 상태에 따라 필터링하여 페이지네이션으로 제공합니다.")
    @GetMapping("/status")
    public ResponseEntity<Page<Festival>> getFestivalsByStatus(
            @Parameter(description = "검색할 축제 상태", required = true) @RequestParam FestivalStatus status,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam(defaultValue = "10") int size) {
        // 모든 축제의 상태를 최신화
        festivalService.updateFestivalStatus();
        Page<Festival> festivals = festivalService.getFestivalsByStatus(status, page, size);
        return ResponseEntity.ok(festivals);
    }

    // 신경 안써도됨.
    @Operation(summary = "JSON 파일에서 축제 데이터 로드", description = "JSON 파일 경로를 제공하여 축제 데이터를 불러옵니다.")
    @PostMapping("/load")
    public ResponseEntity<String> loadFestivalsFromJson(
            @Parameter(description = "JSON 파일 경로", required = true) @RequestBody String filePath) {
        try {
            festivalService.saveFestivalFromJson(filePath);
            return ResponseEntity.ok("Festivals loaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error loading festivals: " + e.getMessage());
        }
    }


    @Operation(summary = "축제 생성 (관리자 기능)", description = "새로운 축제를 생성합니다.")
    @PostMapping("/create")
    public ResponseEntity<Festival> createFestival(
            @Parameter(description = "생성할 축제 데이터", required = true) @RequestBody Festival festival) {
        Festival createdFestival = festivalService.createFestival(festival);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFestival);
    }

    @Operation(summary = "축제 수정 (관리자 기능)", description = "ID를 통해 특정 축제를 수정합니다.")
    @PutMapping("/{id}/update")
    public ResponseEntity<Festival> updateFestival(
            @Parameter(description = "수정할 축제의 ID", required = true) @PathVariable Long id,
            @Parameter(description = "수정할 축제 데이터", required = true) @RequestBody Festival updatedFestival) {
        Festival updated = festivalService.updateFestival(id, updatedFestival);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "축제 삭제 (관리자 기능)", description = "ID를 통해 특정 축제를 삭제합니다.")
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteFestival(
            @Parameter(description = "삭제할 축제의 ID", required = true) @PathVariable Long id) {
        festivalService.deleteFestival(id);
        return ResponseEntity.noContent().build();
    }
}