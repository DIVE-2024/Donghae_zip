package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Accommodation;
import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.repository.AccommodationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AccommodationService {

    @Autowired
    private AccommodationRepository accommodationRepository;

    // 모든 숙박 데이터 가져오기 (페이징 처리)
    public Page<Accommodation> getAllAccommodations(Pageable pageable) {
        return accommodationRepository.findAll(pageable);
    }

    // 특정 unique_id로 숙박시설 정보 가져오기
    public Accommodation getAccommodationById(Long uniqueId) {
        return accommodationRepository.findById(uniqueId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Accommodation not found with id " + uniqueId));
    }


        // 지역별 숙박 데이터 가져오기 (Region enum 사용, 페이징 처리)
    public Page<Accommodation> getAccommodationsByRegion(Region region, Pageable pageable) {
        return accommodationRepository.findByRegion(region, pageable);
    }

    // 지역과 가격대별 숙박 데이터 가져오기 (페이징 처리)
    public Page<Accommodation> getAccommodationsByRegionAndPriceRange(Region region, int minPrice, int maxPrice, Pageable pageable) {
        return accommodationRepository.findByRegionAndAveragePriceBetween(region, minPrice, maxPrice, pageable);
    }

    // 지역과 구/군으로 숙박시설 가져오기
    public Page<Accommodation> getAccommodationsByRegionAndDistrict(Region region, String district, Pageable pageable) {
        return accommodationRepository.findByRegionAndDistrict(region, district, pageable);
    }

    // 가격대별 숙박 데이터 가져오기 (지역 상관없이)
    public Page<Accommodation> getAccommodationsByPriceRange(int minPrice, int maxPrice, Pageable pageable) {
        return accommodationRepository.findByAveragePriceBetween(minPrice, maxPrice, pageable);
    }


    // 지역과 구/군, 가격대별 숙박시설 가져오기
    public Page<Accommodation> getAccommodationsByRegionDistrictAndPriceRange(Region region, String district, int minPrice, int maxPrice, Pageable pageable) {
        return accommodationRepository.findByRegionAndDistrictAndAveragePriceBetween(region, district, minPrice, maxPrice, pageable);
    }
}