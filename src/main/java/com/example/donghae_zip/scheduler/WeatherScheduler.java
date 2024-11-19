package com.example.donghae_zip.scheduler;

import com.example.donghae_zip.service.WeatherService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WeatherScheduler {

    private final WeatherService weatherService;

    public WeatherScheduler(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @Scheduled(cron = "0 0 0,12,18 * * ?") // 하루 3번 실행: 0시, 12시, 18시
    public void updateWeatherData() {
        String[] cities = { "Busan", "Ulsan" };

        for (String city : cities) {
            try {
                // 5일간 예보를 저장
                weatherService.fetchAndSaveWeatherForecast(city);
                System.out.println("Successfully updated weather forecast for " + city);
            } catch (Exception e) {
                System.err.println("Error fetching weather forecast for " + city + ": " + e.getMessage());
            }
        }
    }

}
