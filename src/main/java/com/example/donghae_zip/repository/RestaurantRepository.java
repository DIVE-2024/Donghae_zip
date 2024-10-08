package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // 지역과 해시태그로 식당 데이터 가져오기 (부분 일치 검색)
    Page<Restaurant> findByRegionAndHashtagContaining(Region region, String hashtag, Pageable pageable);

    // 지역으로 식당 데이터 가져오기
    Page<Restaurant> findByRegion(Region region, Pageable pageable);

    // 해시태그로 식당 데이터 가져오기
    Page<Restaurant> findByHashtag(String hashtag,Pageable pageable);

    // 지역에 따른 구/군 목록 중복 없이 가져오기
    @Query("SELECT DISTINCT r.district FROM Restaurant r WHERE r.region = :region")
    List<String> findDistinctDistrictsByRegion(@Param("region") Region region);

    // 지역과 구/군, 해시태그로 식당 데이터 가져오기 (부분 일치 검색)
    Page<Restaurant> findByRegionAndDistrictAndHashtagContaining(Region region, String district, String hashtag, Pageable pageable);

    // 지역과 구/군으로 식당 데이터 가져오기 (구/군 필터링)
    Page<Restaurant> findByRegionAndDistrict(Region region, String district, Pageable pageable);


    // ID로 특정 음식점 조회
    Optional<Restaurant> findById(Long id);

    // 해시태그로 식당 조회
    List<Restaurant> findByHashtag(String hashtag);

    Page<Restaurant> findByHashtagContaining(String hashtag, Pageable pageable);

    @Query("SELECT r FROM Restaurant r LEFT JOIN Favorite f ON r = f.restaurant GROUP BY r ORDER BY COUNT(f.id) DESC")
    Page<Restaurant> findRestaurantsOrderByFavoritesCount(Pageable pageable);

    // 지역과 해시태그에 따른 상위 n개의 음식점 가져오기 (정확한 해시태그 검색)
    List<Restaurant> findTop5ByRegionAndHashtag(Region region, String hashtag, Pageable pageable);

    // 지역과 해시태그에 따른 모든 식당 가져오기 (페이징 처리)
    Page<Restaurant> findAllByRegionAndHashtag(Region region, String hashtag, Pageable pageable);

    // 지역과 해시태그에 따른 식당의 전체 개수 가져오기
    int countByRegionAndHashtag(Region region, String hashtag);

    // 특정 좌표와 반경 내의 식당 데이터 가져오기
    @Query("SELECT r FROM Restaurant r WHERE ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(r.longitude, r.latitude)) <= :radius")
    Page<Restaurant> findRestaurantsWithinRadius(@Param("latitude") double latitude, @Param("longitude") double longitude, @Param("radius") double radius, Pageable pageable);

    // 반경 내 식당 데이터를 해시태그로 필터링하는 쿼리
    @Query("SELECT r FROM Restaurant r WHERE ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(r.longitude, r.latitude)) <= :radius AND r.hashtag LIKE %:hashtag%")
    Page<Restaurant> findRestaurantsWithinRadiusAndHashtag(@Param("latitude") double latitude, @Param("longitude") double longitude, @Param("radius") double radius, @Param("hashtag") String hashtag, Pageable pageable);

    // 특정 좌표와 반경, 카테고리 내의 식당 데이터를 조회하는 메서드
    @Query("SELECT r FROM Restaurant r WHERE " +
            "ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(r.longitude, r.latitude)) <= :radius " +
            "AND r.category = :category")
    Page<Restaurant> findRestaurantsWithinRadiusAndCategory(@Param("latitude") double latitude,
                                                            @Param("longitude") double longitude,
                                                            @Param("radius") double radius,
                                                            @Param("category") String category,
                                                            Pageable pageable);

}
