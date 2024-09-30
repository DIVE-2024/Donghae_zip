package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "trail")
public class Trail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trail_id")
    private Long trailId;  // 둘레길 고유 ID

    @Column(name = "course_name", nullable = false, length = 255)
    private String courseName;  // 코스명

    @ElementCollection
    @Column(name = "image_urls", nullable = true)
    private List<String> imageUrls;  // 이미지 URL 목록

    @Column(name = "start_point", nullable = false, length = 255)
    private String startPoint;  // 시작점

    @Column(name = "end_point", nullable = false, length = 255)
    private String endPoint;  // 종점

    @Column(name = "course_intro", nullable = false, columnDefinition = "TEXT")
    private String courseIntro;  // 코스 소개

    @Column(name = "course_overview", nullable = false, columnDefinition = "TEXT")
    private String courseOverview;  // 코스 개요

    @Column(name = "tourist_points", nullable = false, columnDefinition = "TEXT")
    private String touristPoints;  // 관광 포인트

    @Column(name = "travel_info", nullable = true, columnDefinition = "TEXT")
    private String travelInfo;  // 여행 정보

    @Column(name = "gpx_path", nullable = true, length = 500)
    private String gpxPath;  // GPX 경로 (파일 경로)

    @Column(name = "length", nullable = false, length = 50)
    private String length;  // 둘레길 총 길이 (문자열)

    @Column(name = "time", nullable = false, length = 50)
    private String time;  // 소요 시간 (문자열)

    @Column(name = "difficulty", nullable = false, length = 50)
    private String difficulty;  // 난이도

    @Column(name = "length_in_km", nullable = false)
    private Double lengthInKm;  // 길이 (km, 숫자)

    @Column(name = "time_in_minutes", nullable = false)
    private Integer timeInMinutes;  // 소요 시간 (분 단위)
}
