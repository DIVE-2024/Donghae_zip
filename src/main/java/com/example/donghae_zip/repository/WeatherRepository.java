package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Long> {

    // 특정 지역과 예보 날짜에 해당하는 모든 시간대별 날씨 데이터를 조회
    List<Weather> findByRegionAndForecastDate(String region, String forecastDate);

    // 특정 지역과 날짜 범위에 맞는 날씨 데이터를 조회하는 메서드
    List<Weather> findByRegionAndForecastDateBetween(String region, String startDate, String endDate);

    // 특정 지역, 예보 날짜, 예보 시간에 해당하는 날씨 데이터를 조회
    Weather findByRegionAndForecastDateAndForecastTime(String region, String forecastDate, String forecastTime);

    // 특정 지역과 예보 날짜에 해당하는 최고 기온을 조회
    Weather findTopByRegionAndForecastDateOrderByHighestTemperatureDesc(String region, String forecastDate);

    // 특정 지역과 예보 날짜에 해당하는 최저 기온을 조회
    Weather findTopByRegionAndForecastDateOrderByLowestTemperatureAsc(String region, String forecastDate);

    // 특정 지역과 예보 날짜에 해당하는 데이터가 있는지 확인 (중복 방지)
    boolean existsByRegionAndForecastDateAndForecastTime(String region, String forecastDate, String forecastTime);

    // 중기 예보 저장을 위한 메서드
    Optional<Weather> findFirstByRegionAndForecastDate(String region, String forecastDate);

    // 특정 지역과 날짜에 해당하는 forecastTime이 null인 중기예보 데이터 조회
    List<Weather> findByRegionAndForecastDateAndForecastTimeIsNull(String region, String forecastDate);


}

