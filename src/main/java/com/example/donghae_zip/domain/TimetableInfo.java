package com.example.donghae_zip.domain;

import lombok.Data;

import java.util.Optional;

@Data
public class TimetableInfo {
    private final Optional<DonghaeTimetable> weekdayFirstTrain;
    private final Optional<DonghaeTimetable> weekdayLastTrainToNamchang;
    private final Optional<DonghaeTimetable> weekdayLastTrainToTaehwagang;
    private final Optional<DonghaeTimetable> weekendFirstTrain;
    private final Optional<DonghaeTimetable> weekendLastTrainToNamchang;
    private final Optional<DonghaeTimetable> weekendLastTrainToTaehwagang;
}
