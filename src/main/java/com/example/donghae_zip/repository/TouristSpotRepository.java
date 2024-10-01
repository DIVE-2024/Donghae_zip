package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.TouristSpot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TouristSpotRepository extends JpaRepository<TouristSpot, Long> {

    boolean existsByTitleAndAddress(String title, String address);

    Page<TouristSpot> findByIndoorOutdoor(String indoorOutdoor, Pageable pageable);  // 실내/실외 필터

    Page<TouristSpot> findByPlaceCategory(String placeCategory, Pageable pageable);  // 카테고리 필터

    Page<TouristSpot> findByPlaceCategoryIn(List<String> categories, Pageable pageable);  // 다중 카테고리 필터

    // 제목으로 검색 (부분 일치, 페이지네이션 적용)
    Page<TouristSpot> findByTitleContaining(String title, Pageable pageable);

    // 지역으로 검색 (부분 일치, 페이지네이션 적용)
    Page<TouristSpot> findByRegionContaining(String region, Pageable pageable);

    // 태그로 검색 (한 개 이상의 태그 포함 시, 페이지네이션 적용)
    Page<TouristSpot> findByTagsIn(List<String> tags, Pageable pageable);


    Page<TouristSpot> findByTitleContainingAndPlaceCategoryContainingAndRegionContainingAndTagsContaining(
            String title, String placeCategory, String region, String tag, Pageable pageable);  // 통합 검색
}
