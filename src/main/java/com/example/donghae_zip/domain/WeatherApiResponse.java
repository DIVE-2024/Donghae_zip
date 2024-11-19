package com.example.donghae_zip.domain;

import lombok.Data;
import java.util.List;

@Data
public class WeatherApiResponse {
    private Coord coord;
    private Main main;
    private List<Weather> weather; // 날씨 배열
    private Wind wind;

    @Data
    public static class Coord {
        private double lon; // 경도
        private double lat; // 위도
    }

    @Data
    public static class Main {
        private double temp;        // 현재 온도
        private double feels_like;  // 체감 온도
        private double temp_min;    // 최저 온도
        private double temp_max;    // 최고 온도
        private int pressure;       // 기압
        private int humidity;       // 습도
    }

    @Data
    public static class Weather {
        private String main;        // 날씨 상태 (예: Clouds, Rain 등)
        private String description; // 날씨 상세 설명 (예: broken clouds)
        private String icon;        // 날씨 아이콘 코드
    }

    @Data
    public static class Wind {
        private double speed; // 풍속
        private int deg;      // 풍향
    }
}
