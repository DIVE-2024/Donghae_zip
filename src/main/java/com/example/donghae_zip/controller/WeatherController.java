package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Weather;
import com.example.donghae_zip.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "Weather API", description = "날씨 정보를 조회하는 API")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @Operation(summary = "특정 지역의 1시간 간격 날씨 조회", description = "특정 지역에 대한 1시간 간격의 날씨 정보를 제공합니다.")
    @GetMapping("/api/weather/hourly")
    public ResponseEntity<Map<String, Map<String, String>>> getHourlyWeather(
            @Parameter(description = "지역 이름 (예: 부산, 울산)") @RequestParam String region) {

        // 1시간 간격의 날씨 정보를 호출
        Map<String, Map<String, String>> hourlyWeatherData = weatherService.getHourlyForecastWeather(region);

        // 응답 데이터가 없는 경우
        if (hourlyWeatherData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // 정상 응답
        return ResponseEntity.ok(hourlyWeatherData);
    }

    // 특정 날짜의 날씨 조회
    @Operation(summary = "특정 날짜의 날씨 조회", description = "특정 지역과 날짜에 대한 날씨 정보를 조회합니다.")
    @GetMapping("/api/weather/date")
    public ResponseEntity<List<Weather>> getWeatherByDate(
            @Parameter(description = "지역 이름 (예: 부산, 울산)") @RequestParam String region,
            @Parameter(description = "날짜 (YYYYMMDD 형식)") @RequestParam String date) {

        // 서비스에서 특정 날짜의 날씨 정보 조회
        List<Weather> weatherData = weatherService.getWeatherByDate(region, date);

        if (weatherData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(weatherData);
    }

    // 특정 날짜 범위의 날씨 조회
    @Operation(summary = "특정 날짜 범위의 날씨 조회", description = "특정 지역의 날짜 범위 내의 날씨 정보를 조회합니다.")
    @GetMapping("/api/weather/range")
    public ResponseEntity<List<Weather>> getWeatherByDateRange(
            @Parameter(description = "지역 이름 (예: 부산, 울산)") @RequestParam String region,
            @Parameter(description = "시작 날짜 (YYYYMMDD 형식)") @RequestParam String startDate,
            @Parameter(description = "종료 날짜 (YYYYMMDD 형식)") @RequestParam String endDate) {

        // 서비스에서 날짜 범위의 날씨 정보 조회
        List<Weather> weatherData = weatherService.getWeatherByDateRange(region, startDate, endDate);

        if (weatherData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(weatherData);
    }


}