package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.security.Timestamp;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Weather {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String region;               // 지역

    @Column(name = "forecast_date")
    private String forecastDate;         // 예보 날짜 (YYYYMMDD 형식)

    @Column(name = "forecast_time", nullable = true)
    private String forecastTime;         // 예보 시간 (단기 예보에서 사용)

    private String temperature;          // 시간별 기온 (단기 예보)

    @Column(name = "highest_temperature")
    private String highestTemperature;   // 최고 기온 (중기 예보)

    @Column(name = "lowest_temperature")
    private String lowestTemperature;    // 최저 기온 (중기 예보)

    @Column(name = "precipitation_am")   // 오전 강수 확률 (중기 예보)
    private String precipitationAm;

    @Column(name = "precipitation_pm")   // 오후 강수 확률 (중기 예보)
    private String precipitationPm;

    @Column(name = "precipitation")
    private String precipitation;        // 시간별 강수 확률 (단기 예보)

    @Column(name = "sky_condition")
    private String skyCondition;         // 하늘 상태 (단기 예보)

    @Column(name = "wind_speed")
    private String windSpeed;            // 풍속 (단기 예보)

    @Column(name = "rainfall")
    private String rainfall;             // 강수량 (단기 예보)

}
