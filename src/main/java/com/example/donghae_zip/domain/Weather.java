package com.example.donghae_zip.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Weather {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;               // 기본 키

    @Column(nullable = false)
    private String location;       // 지역 이름 (예: Busan, Ulsan)

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;             // 데이터가 적용되는 날짜 (예보 날짜)

    @Column(nullable = false)
    private java.sql.Time time; // 추가된 필드: 시간 정보 저장

    @Column(nullable = false)
    private double temperature;    // 평균 온도

    @Column(name = "min_temperature")
    private double minTemperature; // 최저 온도

    @Column(name = "max_temperature")
    private double maxTemperature; // 최고 온도

    private String description;    // 날씨 설명 (예: clear sky, rainy)

    private String icon;           // 날씨 아이콘 코드

    @Column(name= "wind_speed")
    private double windSpeed;      // 풍속

    @Column(nullable = false)
    private int humidity;          // 습도

    @Column(nullable = false)
    private int pressure;          // 기압
}
