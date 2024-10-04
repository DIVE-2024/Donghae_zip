package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.DonghaeInfo;
import com.example.donghae_zip.domain.StationWithTimetableInfo;
import com.example.donghae_zip.service.DonghaeInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donghae")
public class DonghaeInfoController {

    @Autowired
    private DonghaeInfoService donghaeInfoService;

    // 동해선 노선의 모든 역 정보 가져오기
    @GetMapping("/donghae-line") // 경로를 구분해서 충돌 방지
    public List<DonghaeInfo> getAllDonghaeStations() {
        return donghaeInfoService.getAllDonghaeLineStations();
    }

    // 모든 역 정보 가져오기
    @GetMapping("/all") // 경로를 구분해서 충돌 방지
    public List<DonghaeInfo> getAllStations() {
        return donghaeInfoService.getAllStations();
    }


    // 특정 역 정보 가져오기
    @GetMapping("/{stationName}")
    public Optional<DonghaeInfo> getStationByName(@PathVariable String stationName) {
        return donghaeInfoService.getStationByName(stationName);
    }
    // 환승 가능한 동해선 역 정보 가져오기
    @GetMapping("/transfer")
    public List<DonghaeInfo> getTransferStations() {
        return donghaeInfoService.getTransferStations();
    }

    // 특정 역의 시설 정보 가져오기
    @GetMapping("/{stationName}/facilities")
    public Optional<String> getStationFacilities(@PathVariable String stationName) {
        return donghaeInfoService.getStationFacilities(stationName);
    }

    // 2023년 승차 인원 기준 상위 5개 역 가져오기
    @GetMapping("/top-boarding-2023")
    public List<DonghaeInfo> getTopBoardingStations2023() {
        return donghaeInfoService.getTopBoardingStations2023();
    }

    // 2023년 하차 인원 기준 상위 5개 역 가져오기
    @GetMapping("/top-alighting-2023")
    public List<DonghaeInfo> getTopAlightingStations2023() {
        return donghaeInfoService.getTopAlightingStations2023();
    }

    // 특정 역의 동해선 정보와 시간표 정보를 함께 가져오기
    @GetMapping("/station/{stationName}")
    public StationWithTimetableInfo getStationInfoWithTimetable(@PathVariable String stationName) {
        return donghaeInfoService.getStationInfoWithTimetable(stationName);
    }

}
