package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Trail;
import com.example.donghae_zip.service.TrailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trails")
@Tag(name = "Trails", description = "둘레길 관련 API")
public class TrailController {

    @Autowired
    private TrailService trailService;

    // 전체 둘레길 조회 메서드
    @Operation(summary = "모든 둘레길 조회", description = "모든 둘레길 정보를 페이지네이션으로 조회합니다.")
    @GetMapping
    public ResponseEntity<Page<Trail>> getAllTrails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<Trail> trails = trailService.getAllTrails(page, size);
        return ResponseEntity.ok(trails);
    }

    @Operation(summary = "ID로 둘레길 조회", description = "ID를 통해 특정 둘레길 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<Trail> getTrailById(@PathVariable Long id) {
        Trail trail = trailService.getTrailById(id);
        return ResponseEntity.ok(trail);
    }

    @Operation(summary = "제목으로 둘레길 검색", description = "제목을 기준으로 둘레길을 페이지네이션으로 검색합니다.")
    @GetMapping("/search/title")
    public ResponseEntity<Page<Trail>> searchByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<Trail> trails = trailService.searchByTitle(title, page, size);
        return ResponseEntity.ok(trails);
    }

    @Operation(summary = "난이도로 둘레길 검색", description = "난이도를 기준으로 둘레길을 페이지네이션으로 검색합니다.")
    @GetMapping("/search/difficulty")
    public ResponseEntity<Page<Trail>> searchByDifficulty(
            @RequestParam String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<Trail> trails = trailService.searchByDifficulty(difficulty, page, size);
        return ResponseEntity.ok(trails);
    }

    @Operation(summary = "소요시간순으로 둘레길 정렬", description = "소요시간순으로 둘레길을 페이지네이션으로 정렬합니다.")
    @GetMapping("/sort/time")
    public ResponseEntity<Page<Trail>> getTrailsSortedByTime(
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<Trail> trails = trailService.getTrailsSortedByTime(direction, page, size);
        return ResponseEntity.ok(trails);
    }

    @Operation(summary = "소요거리순으로 둘레길 정렬", description = "소요거리순으로 둘레길을 페이지네이션으로 정렬합니다.")
    @GetMapping("/sort/length")
    public ResponseEntity<Page<Trail>> getTrailsSortedByLength(
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<Trail> trails = trailService.getTrailsSortedByLength(direction, page, size);
        return ResponseEntity.ok(trails);
    }

    @Operation(summary = "둘레길 생성", description = "새로운 둘레길 정보를 생성합니다. (관리자 기능)")
    @PostMapping
    public ResponseEntity<Trail> createTrail(@RequestBody Trail trail) {
        Trail createdTrail = trailService.createTrail(trail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrail);
    }

    @Operation(summary = "둘레길 수정", description = "기존 둘레길 정보를 수정합니다. (관리자 기능)")
    @PutMapping("/{id}")
    public ResponseEntity<Trail> updateTrail(@PathVariable Long id, @RequestBody Trail updatedTrail) {
        Trail trail = trailService.updateTrail(id, updatedTrail);
        return ResponseEntity.ok(trail);
    }

    @Operation(summary = "둘레길 삭제", description = "특정 둘레길 정보를 삭제합니다. (관리자 기능)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrail(@PathVariable Long id) {
        trailService.deleteTrail(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "둘레길 데이터 가져오기", description = "JSON 파일에서 둘레길 데이터를 읽어와 데이터베이스에 저장합니다.")
    @GetMapping("/import-trail")
    public String importTrailData() {
        String filePath = "C:\\Users\\sh980\\workspace\\둘렛길(최종).json";  // JSON 파일 경로
        try {
            trailService.saveTrailFromJson(filePath);
            return "Trail data imported successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error importing trail data: " + e.getMessage();
        }
    }
}
