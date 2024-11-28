package com.example.donghae_zip.domain;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TravelDetailDTO {
    private Long detailId;
    private String placeType;
    private LocalDate travelDate;
    private Long placeId;
    private String startTime;
    private String endTime;

    public TravelDetailDTO(TravelDetail detail) {
        this.detailId = detail.getDetailId();
        this.placeType = detail.getPlaceType().toString();
        this.travelDate = detail.getTravelDate();
        this.placeId = detail.getPlaceId();
        this.startTime = detail.getStartTime();
        this.endTime = detail.getEndTime();
    }
}
