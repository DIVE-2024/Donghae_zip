package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.DonghaeTimetable;
import com.example.donghae_zip.domain.TimetableInfo;
import com.example.donghae_zip.service.DonghaeTimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donghae_timetable")
public class DonghaeTimetableController {

    @Autowired
    private DonghaeTimetableService donghaeTimetableService;

    // 모든 동해선 운행 시간표 가져오기
    @GetMapping
    public List<DonghaeTimetable> getAllTimetables() {
        return donghaeTimetableService.getAllTimetables();
    }

    // 평일 시간표 가져오기
    @GetMapping("/weekday")
    public List<DonghaeTimetable> getWeekdayTimetables() {
        return donghaeTimetableService.getWeekdayTimetables();
    }

    // 주말/휴일 시간표 가져오기
    @GetMapping("/weekend")
    public List<DonghaeTimetable> getWeekendTimetables() {
        return donghaeTimetableService.getWeekendTimetables();
    }

    // 특정 역의 운행 정보 가져오기
    @GetMapping("/station/{stationName}/timetable")
    public TimetableInfo getTimetableInfoForStation(@PathVariable String stationName) {
        return donghaeTimetableService.getTimetableInfoForStation(stationName);
    }
}
