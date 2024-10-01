package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Accommodation;
import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.service.AccommodationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {

    @Autowired
    private AccommodationService accommodationService;

    // 모든 숙박 데이터 가져오기
    @GetMapping
    public List<Accommodation> getAllAccommodations() {
        return accommodationService.getAllAccommodations();
    }

    // 지역별 숙박 데이터 가져오기 (Region enum 사용)
    @GetMapping("/region/{region}")
    public List<Accommodation> getAccommodationsByRegion(@PathVariable Region region) {
        return accommodationService.getAccommodationsByRegion(region);
    }

    // 지역과 가격대별 숙박 데이터 가져오기
    @GetMapping("/region/{region}/price-range")
    public List<Accommodation> getAccommodationsByRegionAndPriceRange(
            @PathVariable Region region,
            @RequestParam int minPrice,
            @RequestParam int maxPrice) {
        return accommodationService.getAccommodationsByRegionAndPriceRange(region, minPrice, maxPrice);
    }

}
