package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.DonghaeInfo;
import com.example.donghae_zip.domain.StationWithTimetableInfo;
import com.example.donghae_zip.domain.TimetableInfo;
import com.example.donghae_zip.repository.DonghaeInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonghaeInfoService {

    @Autowired
    private DonghaeInfoRepository donghaeInfoRepository;

    @Autowired
    private DonghaeTimetableService donghaeTimetableService;

    // 모든 동해선 역 정보 가져오기
    public List<DonghaeInfo> getAllStations() {
        return donghaeInfoRepository.findAll();
    }

    // 특정 역 정보 가져오기
    public Optional<DonghaeInfo> getStationByName(String stationName) {
        return donghaeInfoRepository.findById(stationName);
    }
    // 환승 가능한 동해선 역 정보 가져오기
    public List<DonghaeInfo> getTransferStations() {
        return donghaeInfoRepository.findByTransferAvailable("가능");
    }
    // 특정 역의 시설 정보 가져오기
    public Optional<String> getStationFacilities(String stationName) {
        Optional<DonghaeInfo> station = donghaeInfoRepository.findById(stationName);
        return station.map(DonghaeInfo::getStationFacilities);
    }

    // 2023년 승차 인원 기준 상위 5개 역 가져오기
    public List<DonghaeInfo> getTopBoardingStations2023() {
        return donghaeInfoRepository.findTop5ByOrderByBoarding2023Desc();
    }

    // 2023년 하차 인원 기준 상위 5개 역 가져오기
    public List<DonghaeInfo> getTopAlightingStations2023() {
        return donghaeInfoRepository.findTop5ByOrderByAlighting2023Desc();
    }

    // 특정 역의 동해선 정보와 평일/휴일 첫차/막차 정보를 함께 가져오기
    public StationWithTimetableInfo getStationInfoWithTimetable(String stationName) {
        Optional<DonghaeInfo> stationInfo = donghaeInfoRepository.findById(stationName);
        TimetableInfo timetableInfo = donghaeTimetableService.getTimetableInfoForStation(stationName);

        return stationInfo.map(info -> new StationWithTimetableInfo(info, timetableInfo)).orElse(null);
    }
}
