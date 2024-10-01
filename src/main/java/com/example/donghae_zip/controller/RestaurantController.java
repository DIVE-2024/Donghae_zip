package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import com.example.donghae_zip.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    // 특정 ID의 식당 데이터 가져오기
    @GetMapping("/{id}")
    public Optional<Restaurant> getRestaurantById(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id);
    }

    // 지역과 해시태그로 식당 데이터 가져오기
    @GetMapping("/search")
    public List<Restaurant> getRestaurantsByRegionAndHashtag(
            @RequestParam("region") Region region,
            @RequestParam("hashtag") String hashtag) {
        return restaurantService.getRestaurantsByRegionAndHashtag(region, hashtag);
    }

    // 해시태그로 식당 데이터 가져오기
    @GetMapping("/hashtag/{hashtag}")
    public List<Restaurant> getRestaurantsByHashtag(@PathVariable String hashtag) {
        return restaurantService.getRestaurantsByHashtag(hashtag);
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
