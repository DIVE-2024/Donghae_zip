package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.DonghaeInfo;
import com.example.donghae_zip.repository.DonghaeInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonghaeInfoService {

    @Autowired
    private DonghaeInfoRepository donghaeInfoRepository;

    // 모든 동해선 역 정보 가져오기
    public List<DonghaeInfo> getAllStations() {
        return donghaeInfoRepository.findAll();
    }

    // 특정 역 정보 가져오기
    public Optional<DonghaeInfo> getStationByName(String stationName) {
        return donghaeInfoRepository.findById(stationName);
    }
}
