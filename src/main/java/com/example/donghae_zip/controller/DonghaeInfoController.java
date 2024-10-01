package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.DonghaeInfo;
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

    // 모든 동해선 역 정보 가져오기
    @GetMapping
    public List<DonghaeInfo> getAllStations() {
        return donghaeInfoService.getAllStations();
    }

    // 특정 역 정보 가져오기
    @GetMapping("/{stationName}")
    public Optional<DonghaeInfo> getStationByName(@PathVariable String stationName) {
        return donghaeInfoService.getStationByName(stationName);
    }
}
