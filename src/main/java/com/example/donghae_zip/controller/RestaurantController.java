package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import com.example.donghae_zip.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    // 모든 식당 데이터 가져오기
    @GetMapping
    public Page<Restaurant> getAllRestaurants(Pageable pageable) {
        return restaurantService.getAllRestaurants(pageable);
    }

    // 특정 ID의 식당 데이터 가져오기
    @GetMapping("/{id}")
    public Optional<Restaurant> getRestaurantById(@PathVariable Long id) {
        // 요청이 제대로 들어오는지 확인하기 위해 sout 추가
        System.out.println("Restaurant ID: " + id + "에 대한 요청이 들어왔습니다.");

        Optional<Restaurant> restaurant = restaurantService.getRestaurantById(id);

        if (restaurant.isPresent()) {
            System.out.println("Restaurant found: " + restaurant.get().getName());
        } else {
            System.out.println("Restaurant with ID: " + id + " not found.");
        }

        return restaurant;
    }

    // 지역과 해시태그로 식당 데이터 가져오기 (페이징 처리)
    @GetMapping("/search")
    public Page<Restaurant> getRestaurantsByRegionAndHashtag(
            @RequestParam("region") Region region,
            @RequestParam("hashtag") String hashtag,
            Pageable pageable) {
        return restaurantService.getRestaurantsByRegionAndHashtag(region, hashtag, pageable);
    }

    // 해시태그로 식당 데이터 가져오기 (페이징 처리)
    @GetMapping("/hashtag/{hashtag}")
    public Page<Restaurant> getRestaurantsByHashtag(@PathVariable String hashtag, Pageable pageable) {
        return restaurantService.getRestaurantsByHashtag(hashtag, pageable);
    }

    // 지역과 구/군, 해시태그로 식당 데이터 가져오기
    @GetMapping("/searchByDistrict")
    public Page<Restaurant> getRestaurantsByRegionAndDistrictAndHashtag(
            @RequestParam("region") Region region,
            @RequestParam("district") String district,
            @RequestParam("hashtag") String hashtag,
            Pageable pageable) {
        return restaurantService.getRestaurantsByRegionAndDistrictAndHashtag(region, district, hashtag, pageable);
    }

    // 지역과 구/군으로 식당 데이터 가져오기
    @GetMapping("/searchByRegionAndDistrict")
    public Page<Restaurant> getRestaurantsByRegionAndDistrict(
            @RequestParam("region") Region region,
            @RequestParam("district") String district,
            Pageable pageable) {
        return restaurantService.getRestaurantsByRegionAndDistrict(region, district, pageable);
    }

    // 특정 식당의 주소를 기반으로 좌표 업데이트
    @PutMapping("/{id}/update-coordinates")
    public ResponseEntity<String> updateRestaurantCoordinates(@PathVariable Long id) {
        boolean isUpdated = restaurantService.updateCoordinatesByAddress(id);

        if (isUpdated) {
            return ResponseEntity.ok("Coordinates updated successfully for restaurant ID: " + id);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to update coordinates for restaurant ID: " + id);
        }
    }


    // 모든 식당 데이터의 경위도 업데이트
    @PutMapping("/update-all-coordinates")
    public ResponseEntity<String> updateAllRestaurantCoordinates() {
        restaurantService.updateAllRestaurantCoordinates();
        return ResponseEntity.ok("Coordinates updated successfully for all restaurants.");
    }
}
