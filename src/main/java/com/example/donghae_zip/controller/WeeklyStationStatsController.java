package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.WeeklyStationStats;
import com.example.donghae_zip.service.WeeklyStationStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/station-stats")
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
        return weeklyStationStatsService.getStatsByStationAndWeek(stationName, year, month, week);
    }
}
