package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.WeeklyStationStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WeeklyStationStatsRepository extends JpaRepository<WeeklyStationStats, Long> {

    // 연도와 월의 중복 없는 값 가져오기
    @Query("SELECT DISTINCT SUBSTRING(week, 1, 9) FROM WeeklyStationStats")
    List<String> findDistinctYearsAndMonths();

    // 특정 연도와 월에 해당하는 주차 정보를 가져오기
    @Query("SELECT DISTINCT week FROM WeeklyStationStats WHERE week LIKE :yearAndMonth%")
    List<String> findDistinctWeeksByYearAndMonth(@Param("yearAndMonth") String yearAndMonth);

    // 특정 역과 주차에 해당하는 시간대별 데이터 가져오기
    List<WeeklyStationStats> findByStationNameAndWeek(String stationName, String week);
}
