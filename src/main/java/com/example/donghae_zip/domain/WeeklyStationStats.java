package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "weekly_station_stats")
@Data // Lombok을 사용하여 Getter/Setter 자동 생성
public class WeeklyStationStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "week", nullable = false)
    private String week;

    @Column(name = "station_name", nullable = false)
    private String stationName;

    @Column(name = "time_period", nullable = false)
    private String timePeriod;

    @Column(name = "avg_alighting_passengers")
    private Integer avgAlightingPassengers;

    @Column(name = "avg_boarding_passengers")
    private Integer avgBoardingPassengers;
}
