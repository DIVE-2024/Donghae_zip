package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Accommodation;
import com.example.donghae_zip.domain.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    Page<Accommodation> findByRegion(Region region, Pageable pageable);

    Page<Accommodation> findByRegionAndAveragePriceBetween(Region region, int minPrice, int maxPrice, Pageable pageable);

    // 지역과 구/군으로 숙박시설 검색
    Page<Accommodation> findByRegionAndDistrict(Region region, String district, Pageable pageable);

    // 지역과 구/군, 가격대별 숙박시설 검색
    Page<Accommodation> findByRegionAndDistrictAndAveragePriceBetween(Region region, String district, int minPrice, int maxPrice, Pageable pageable);

    // 가격대별 숙박시설 검색
    Page<Accommodation> findByAveragePriceBetween(int minPrice, int maxPrice, Pageable pageable);

    // ID로 특정 숙박시설 조회
    Optional<Accommodation> findById(Long uniqueId);


}
