package com.example.donghae_zip.domain;

import lombok.Data;

@Data
public class StationWithTimetableInfo {
    private DonghaeInfo stationInfo;
    private TimetableInfo timetableInfo;

    // 기본 생성자
    public StationWithTimetableInfo() {}

    // DonghaeInfo와 TimetableInfo를 받는 생성자
    public StationWithTimetableInfo(DonghaeInfo stationInfo, TimetableInfo timetableInfo) {
        this.stationInfo = stationInfo;
        this.timetableInfo = timetableInfo;
    }
}
