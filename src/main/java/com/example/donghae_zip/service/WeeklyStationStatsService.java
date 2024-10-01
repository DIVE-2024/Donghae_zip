package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.WeeklyStationStats;
import com.example.donghae_zip.repository.WeeklyStationStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeeklyStationStatsService {

    @Autowired
    private WeeklyStationStatsRepository weeklyStationStatsRepository;

    // 모든 연도와 월 정보를 가져오기
    public List<String> getAllYearsAndMonths() {
        return weeklyStationStatsRepository.findDistinctYearsAndMonths();
    }

    // 특정 연도와 월에 해당하는 주차 정보를 가져오기
    public List<String> getWeeksByYearAndMonth(String yearAndMonth) {
        return weeklyStationStatsRepository.findDistinctWeeksByYearAndMonth(yearAndMonth);
    }

    // 특정 역과 주차에 해당하는 시간대별 데이터 가져오기
    public List<WeeklyStationStats> getStatsByStationAndWeek(String stationName, String year, String month, String week) {
        String weekPattern = year + "년 " + month + "월 " + week + "주차";
        return weeklyStationStatsRepository.findByStationNameAndWeek(stationName, weekPattern);
    }
}
