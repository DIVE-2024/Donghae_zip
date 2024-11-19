package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Weather;
import com.example.donghae_zip.service.WeatherService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    // 특정 지역과 날짜 범위의 날씨 데이터를 반환
    @GetMapping
    public List<Weather> getWeather(
            @RequestParam String location,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date)
    {
        System.out.println("Location: " + location);
        System.out.println("Date: " + date);

        LocalDate localDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        Date startOfDay = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(localDate.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant());

        List<Weather> dailyWeather = weatherService.getWeather(location, startOfDay, endOfDay);

        return dailyWeather.stream()
                .filter(weather -> {
                    String time = weather.getTime().toString();
                    return time.equals("00:00:00") || time.equals("12:00:00") || time.equals("18:00:00");
                })
                .collect(Collectors.toList());
    }




    @PostMapping("/update")
    public String updateWeather(
            @RequestParam String location,
            @RequestParam(defaultValue = "forecast") String type) {
        try {
            if (type.equals("current")) {
                weatherService.fetchAndSaveWeather(location); // 현재 날씨 저장
                return "Current weather data for " + location + " updated successfully!";
            } else if (type.equals("forecast")) {
                weatherService.fetchAndSaveWeatherForecast(location); // 5일 예보 저장
                return "Weather forecast data for " + location + " fetched and saved successfully!";
            } else {
                return "Invalid type parameter. Use 'current' or 'forecast'.";
            }
        } catch (Exception e) {
            return "Error updating weather data for " + location + ": " + e.getMessage();
        }
    }


    // 테스트용 엔드포인트: 여러 도시의 7일간 날씨 데이터를 강제로 저장
    @PostMapping("/fetch-forecast")
    public Map<String, String> fetchAndSaveWeatherForecast() {
        String[] cities = { "Busan", "Ulsan" };
        Map<String, String> result = new HashMap<>();

        for (String city : cities) {
            try {
                weatherService.fetchAndSaveWeatherForecast(city);
                result.put(city, "Weather forecast fetched successfully.");
            } catch (Exception e) {
                result.put(city, "Error: " + e.getMessage());
            }
        }
        return result;
    }
}
