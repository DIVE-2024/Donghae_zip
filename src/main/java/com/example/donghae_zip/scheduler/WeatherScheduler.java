package com.example.donghae_zip.scheduler;

import com.example.donghae_zip.service.WeatherService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class WeatherScheduler {

    private final WeatherService weatherService;

    // 부산과 울산의 지역 코드
    private static final String BUSAN_REG_ID = "11H20201"; // 부산 지역 코드
    private static final String ULSAN_REG_ID = "11H10701"; // 울산 지역 코드

    // 생성자 주입 방식으로 WeatherService 주입
    public WeatherScheduler(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    // 매 1시간마다 단기예보 갱신 (고정된 주기 사용)
    @Scheduled(fixedRate = 3600000) // 1시간(3600000ms)마다 실행
    public void updateWeatherData() {
        // 부산 지역의 날씨 데이터 갱신
        String busanRegion = "부산";
        weatherService.getHourlyForecastWeather(busanRegion);
        System.out.println("Weather data updated for region: " + busanRegion);

        // 울산 지역의 날씨 데이터 갱신
        String ulsanRegion = "울산";
        weatherService.getHourlyForecastWeather(ulsanRegion);
        System.out.println("Weather data updated for region: " + ulsanRegion);
    }


/*    // 테스트 용도 .. 매 1분마다 중기 예보갱신
    @Scheduled(fixedRate = 60000) // 1분(60000ms)마다 실행*/


    // 매일 1번 중기 예보 갱신 (매일 자정에 실행)
    @Scheduled(cron = "0 0 6,18 * * ?") // 매일 6시, 18시에 실행

    public void updateMidTermTemperature() {
        // 부산 기온 예보 가져오기
        String busanResponse = weatherService.getMidTermTemperature(BUSAN_REG_ID);
        weatherService.saveTemperatureData(busanResponse, "부산"); // WeatherService에서 호출

        // 울산 기온 예보 가져오기
        String ulsanResponse = weatherService.getMidTermTemperature(ULSAN_REG_ID);
        weatherService.saveTemperatureData(ulsanResponse, "울산"); // WeatherService에서 호출
    }
}