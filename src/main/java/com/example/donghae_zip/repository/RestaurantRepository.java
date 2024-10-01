package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // 지역과 해시태그로 식당 데이터 가져오기 (부분 일치 검색)
    List<Restaurant> findByRegionAndHashtagContaining(Region region, String hashtag);

    // 해시태그로 식당 데이터 가져오기
    List<Restaurant> findByHashtag(String hashtag);
}
