package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Member;
import com.example.donghae_zip.domain.Travel;
import com.example.donghae_zip.repository.MemberRepository;
import com.example.donghae_zip.service.TravelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    private final TravelService travelService;
    private final MemberRepository memberRepository;

    public TravelController(TravelService travelService, MemberRepository memberRepository) {
        this.travelService = travelService;
        this.memberRepository = memberRepository;
    }

    // 1. 특정 사용자 ID로 여행 목록 조회
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Travel>> getUserTravels(@PathVariable String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        List<Travel> travels = travelService.getUserTravels(member);
        return ResponseEntity.ok(travels);
    }

    @PostMapping
    public ResponseEntity<Travel> createTravel(@RequestBody Travel travel, @RequestParam String email) {
        System.out.println("Received email: " + email);
        System.out.println("Received travel data: " + travel);

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        travel.setMember(member); // Member 매핑

        // start_date와 end_date가 없는 상태로 저장
        Travel createdTravel = travelService.saveTravel(travel);
        return ResponseEntity.ok(createdTravel);
    }

    @PatchMapping("/{travelId}/dates")
    public ResponseEntity<Travel> updateTravelDates(
            @PathVariable Long travelId,
            @RequestBody Map<String, String> dates
    ) {
        String startDate = dates.get("startDate");
        String endDate = dates.get("endDate");

        System.out.println(travelId);
        System.out.println(startDate + " " + endDate);

        Travel travel = travelService.getTravelById(travelId);

        if (startDate != null) {
            travel.setStartDate(LocalDate.parse(startDate));
        }
        if (endDate != null) {
            travel.setEndDate(LocalDate.parse(endDate));
        }

        Travel updatedTravel = travelService.saveTravel(travel);
        return ResponseEntity.ok(updatedTravel);
    }

    @PatchMapping("/{travelId}/reset-dates")
    public ResponseEntity<Travel> resetTravelDates(@PathVariable Long travelId, @RequestParam String email) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }

        Travel travel = travelService.getTravelById(travelId);

        // 권한 확인
        if (!travel.getMember().getEmail().equals(email)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        // 날짜 초기화
        travel.setStartDate(null);
        travel.setEndDate(null);

        Travel updatedTravel = travelService.saveTravel(travel);
        return ResponseEntity.ok(updatedTravel);
    }



    // 3. 특정 여행 ID로 여행 삭제 (권한 확인 추가)
    @DeleteMapping("/{travelId}")
    public ResponseEntity<Void> deleteTravel(@PathVariable Long travelId, @RequestParam String email) {
        Travel travel = travelService.getTravelById(travelId);
        if (!travel.getMember().getEmail().equals(email)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        travelService.deleteTravel(travelId);
        return ResponseEntity.noContent().build();
    }

    // 4. 특정 여행 ID로 여행 정보 조회 (권한 확인 추가)
    @GetMapping("/{travelId}")
    public ResponseEntity<Travel> getTravelById(@PathVariable Long travelId, @RequestParam String email) {
        Travel travel = travelService.getTravelById(travelId);
        if (!travel.getMember().getEmail().equals(email)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        return ResponseEntity.ok(travel);
    }
}
