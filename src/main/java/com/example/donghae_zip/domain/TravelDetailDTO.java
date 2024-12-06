package com.example.donghae_zip.domain;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TravelDetailDTO {
    private Long detailId;
    private PlaceType placeType; // 열거형 타입으로 유지
    private LocalDate travelDate;
    private Long placeId;
    private String startTime;
    private String endTime;
    private String placeTitle; // 장소 제목 추가

    // 기존 생성자
    public TravelDetailDTO(TravelDetail detail) {
        this.detailId = detail.getDetailId();
        this.placeType = detail.getPlaceType(); // 열거형 타입 그대로 설정
        this.travelDate = detail.getTravelDate();
        this.placeId = detail.getPlaceId();
        this.startTime = detail.getStartTime();
        this.endTime = detail.getEndTime();
    }

    // 새로운 생성자: 제목 포함
    public TravelDetailDTO(Long detailId, PlaceType placeType, LocalDate travelDate, Long placeId,
                           String startTime, String endTime, String placeTitle) {
        this.detailId = detailId;
        this.placeType = placeType; // 열거형 타입 그대로 설정
        this.travelDate = travelDate;
        this.placeId = placeId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.placeTitle = placeTitle;
    }
}

