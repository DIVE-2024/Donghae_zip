package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.WeeklyStationStats;
import com.example.donghae_zip.service.WeeklyStationStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/station-stats")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 도메인 주소
public class WeeklyStationStatsController {

    @Autowired
    private WeeklyStationStatsService weeklyStationStatsService;


    // 모든 연도와 월 정보를 가져오기
    @GetMapping("/years-and-months")
    public List<String> getAllYearsAndMonths() {
        return weeklyStationStatsService.getAllYearsAndMonths();
    }

    // 특정 연도와 월에 해당하는 주차 정보 가져오기
    @GetMapping("/weeks/{yearAndMonth}")
    public List<String> getWeeksByYearAndMonth(@PathVariable String yearAndMonth) {
        return weeklyStationStatsService.getWeeksByYearAndMonth(yearAndMonth);
    }

    // 특정 역과 주차에 해당하는 시간대별 데이터 가져오기
    @GetMapping("/{stationName}/{year}/{month}/{week}")
    public List<WeeklyStationStats> getStatsByStationAndWeek(
            @PathVariable String stationName,
            @PathVariable String year,
            @PathVariable String month,
            @PathVariable String week) {

        // 파라미터 확인을 위한 로그 출력
        System.out.println("Station: " + stationName + ", Year: " + year + ", Month: " + month + ", Week: " + week);

        // 주입된 서비스 인스턴스를 사용하여 데이터 조회
        List<WeeklyStationStats> stats = weeklyStationStatsService.getStatsByStationAndWeek(stationName, year, month, week);

        // 결과 로그 출력
        System.out.println("Returned stats: " + stats);

        return stats;
    }

    // 모든 역 이름 가져오기
    @GetMapping("/stations")
    public List<String> getAllStations() {
        return weeklyStationStatsService.getAllStations();
    }
}
