package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Accommodation;
import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.repository.AccommodationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccommodationService {

    @Autowired
    private AccommodationRepository accommodationRepository;

    // 모든 숙박 데이터 가져오기
    public List<Accommodation> getAllAccommodations() {
        return accommodationRepository.findAll();
    }

    // 지역별 숙박 데이터 가져오기 (Region enum 사용)
    public List<Accommodation> getAccommodationsByRegion(Region region) {
        return accommodationRepository.findByRegion(region);
    }

    // 지역과 가격대별 숙박 데이터 가져오기
    public List<Accommodation> getAccommodationsByRegionAndPriceRange(Region region, int minPrice, int maxPrice) {
        return accommodationRepository.findByRegionAndAveragePriceBetween(region, minPrice, maxPrice);
    }


}