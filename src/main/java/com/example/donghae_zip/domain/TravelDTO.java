package com.example.donghae_zip.domain;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TravelDTO {
    private Long travelId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;

    private List<TravelDetailDTO> travelDetails;

    public TravelDTO(Travel travel) {
        this.travelId = travel.getTravelId();
        this.title = travel.getTitle();
        this.startDate = travel.getStartDate();
        this.endDate = travel.getEndDate();
        this.travelDetails = travel.getTravelDetails().stream()
                .map(TravelDetailDTO::new)
                .collect(Collectors.toList());
    }
}
