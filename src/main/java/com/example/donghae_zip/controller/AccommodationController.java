package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Accommodation;
import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.service.AccommodationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {

    @Autowired
    private AccommodationService accommodationService;

    // 모든 숙박 데이터 가져오기 (페이징 처리)
    @GetMapping
    public Page<Accommodation> getAllAccommodations(Pageable pageable) {
        return accommodationService.getAllAccommodations(pageable);
    }

    // 특정 unique_id로 숙박시설 정보 가져오기
    @GetMapping("/{uniqueId}")
    public Accommodation getAccommodationById(@PathVariable("uniqueId") Long uniqueId) {
        return accommodationService.getAccommodationById(uniqueId);
    }

    // 지역별 숙박 데이터 가져오기 (Region enum 사용, 페이징 처리)
    @GetMapping("/region/{region}")
    public Page<Accommodation> getAccommodationsByRegion(@PathVariable Region region, Pageable pageable) {
        return accommodationService.getAccommodationsByRegion(region, pageable);
    }

    // 가격대별 숙박 데이터 가져오기 (지역 없이)
    @GetMapping("/price-range")
    public Page<Accommodation> getAccommodationsByPriceRange(
            @RequestParam int minPrice,
            @RequestParam int maxPrice,
            Pageable pageable) {
        return accommodationService.getAccommodationsByPriceRange(minPrice, maxPrice, pageable);
    }

    // 지역과 가격대별 숙박 데이터 가져오기 (페이징 처리)
    @GetMapping("/region/{region}/price-range")
    public Page<Accommodation> getAccommodationsByRegionAndPriceRange(
            @PathVariable Region region,
            @RequestParam int minPrice,
            @RequestParam int maxPrice,
            Pageable pageable) {
        return accommodationService.getAccommodationsByRegionAndPriceRange(region, minPrice, maxPrice, pageable);
    }

    // 지역과 구/군으로 숙박시설 가져오기
    @GetMapping("/searchByDistrict")
    public Page<Accommodation> getAccommodationsByRegionAndDistrict(
            @RequestParam("region") Region region,
            @RequestParam("district") String district,
            Pageable pageable) {
        return accommodationService.getAccommodationsByRegionAndDistrict(region, district, pageable);
    }

    // 지역과 구/군, 가격대별 숙박시설 가져오기
    @GetMapping("/searchByDistrictAndPrice")
    public Page<Accommodation> getAccommodationsByRegionDistrictAndPriceRange(
            @RequestParam("region") Region region,
            @RequestParam("district") String district,
            @RequestParam("minPrice") int minPrice,
            @RequestParam("maxPrice") int maxPrice,
            Pageable pageable) {
        return accommodationService.getAccommodationsByRegionDistrictAndPriceRange(region, district, minPrice, maxPrice, pageable);
    }
}
