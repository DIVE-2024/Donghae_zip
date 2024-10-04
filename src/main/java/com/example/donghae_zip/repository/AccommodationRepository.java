package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Accommodation;
import com.example.donghae_zip.domain.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

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

    //특정 경위도 좌표를 기준으로 반경 내 숙박시설을 검색
    @Query(value = "SELECT * FROM accommodation WHERE ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(longitude, latitude)) <= :radius",
            countQuery = "SELECT count(*) FROM accommodation WHERE ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(longitude, latitude)) <= :radius",
            nativeQuery = true)
    Page<Accommodation> findWithinRadius(
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radius") double radius,
            Pageable pageable);

}
