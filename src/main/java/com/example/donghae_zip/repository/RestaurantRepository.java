package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // 지역과 해시태그로 식당 데이터 가져오기 (부분 일치 검색)
    Page<Restaurant> findByRegionAndHashtagContaining(Region region, String hashtag, Pageable pageable);

    // 해시태그로 식당 데이터 가져오기
    Page<Restaurant> findByHashtag(String hashtag,Pageable pageable);

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

}
