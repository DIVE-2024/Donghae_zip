package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Weather;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface WeatherRepository extends JpaRepository<Weather, Long> {

    // 특정 지역과 날짜 범위의 데이터를 조회
    List<Weather> findByLocationAndDateBetween(String location, Date startDate, Date endDate);

    // 특정 날짜와 지역의 데이터를 조회
    Weather findByLocationAndDate(String location, Date date);

    // 중복 확인 메서드
    Optional<Weather> findByLocationAndDateAndTime(String location, Date date, Time time);
}
