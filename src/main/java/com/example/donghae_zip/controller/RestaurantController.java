package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import com.example.donghae_zip.repository.RestaurantRepository;
import com.example.donghae_zip.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")  // 프론트엔드 도메인 허용
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    // 모든 식당 데이터 가져오기
    @GetMapping
    public Page<Restaurant> getAllRestaurants(Pageable pageable) {
        return restaurantService.getAllRestaurants(pageable);
    }

    // 해시태그 목록 가져오기
    @GetMapping("/hashtags")
    public List<String> getAllHashtags() {
        return restaurantService.getAllHashtags();
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

    // 지역으로 식당 데이터 가져오기 (페이징 처리)
    @GetMapping("/region/{region}")
    public Page<Restaurant> getRestaurantsByRegion(
            @PathVariable("region") Region region,
            Pageable pageable) {
        return restaurantService.getRestaurantsByRegion(region, pageable);
    }

    @GetMapping("/region/{region}/hashtags")
    public ResponseEntity<Map<String, Map<String, Object>>> getRestaurantsByRegionAndHashtag(
            @PathVariable("region") Region region) {
        Map<String, Map<String, Object>> result = restaurantService.getTopRestaurantsByRegionAndHashtag(region, 5);
        return ResponseEntity.ok(result);
    }


    @GetMapping("/region/{region}/hashtag/{hashtag}")
    public Page<Restaurant> getAllRestaurantsByRegionAndHashtag(
            @PathVariable String region,
            @PathVariable String hashtag,
            Pageable pageable) {
        if (!hashtag.startsWith("#")) {
            hashtag = "#" + hashtag;
        }
        Region regionEnum = Region.valueOf(region.toUpperCase());
        return restaurantService.getAllRestaurantsByRegionAndHashtag(regionEnum, hashtag, pageable);
    }

    // 지역에 따른 구/군 목록 가져오기
    @GetMapping("/region/{region}/districts")
    public List<String> getDistrictsByRegion(@PathVariable("region") Region region) {
        // region에 맞는 구/군 목록을 반환하는 로직 (예: 부산 지역에 속한 구/군)
        return restaurantService.getDistrictsByRegion(region);
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

    // 특정 좌표와 반경 내의 식당 데이터 가져오기
    @GetMapping("/radius")
    public Page<Restaurant> getRestaurantsWithinRadius(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("radius") double radius,
            Pageable pageable) {
        return restaurantService.getRestaurantsWithinRadius(latitude, longitude, radius, pageable);
    }

    // 특정 좌표와 반경, 카테고리 내의 식당 데이터 가져오기
    @GetMapping("/radius/category")
    public Page<Restaurant> getRestaurantsWithinRadiusAndCategory(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("radius") double radius,
            @RequestParam("category") String category,  // 카테고리 필터 추가
            Pageable pageable) {

        return restaurantService.getRestaurantsWithinRadiusAndCategory(latitude, longitude, radius, category, pageable);
    }

    // 특정 좌표와 반경, 해시태그 내의 식당 데이터 가져오기
    @GetMapping("/radius/hashtag")
    public Page<Restaurant> getRestaurantsWithinRadiusAndHashtag(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("radius") double radius,
            @RequestParam("hashtag") String hashtag,
            Pageable pageable) {
        return restaurantService.getRestaurantsWithinRadiusAndHashtag(latitude, longitude, radius, hashtag, pageable);
    }

    // 반경 내에 존재하는 식당의 해시태그 목록 제공
    @GetMapping("/radius/hashtags")
    public List<String> getHashtagsWithinRadius(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("radius") double radius,
            Pageable pageable) {  // Pageable 파라미터 추가

        List<Restaurant> restaurants = restaurantRepository.findRestaurantsWithinRadius(latitude, longitude, radius, pageable).getContent(); // Pageable 사용

        Set<String> uniqueHashtags = new HashSet<>();
        for (Restaurant restaurant : restaurants) {
            uniqueHashtags.add(restaurant.getHashtag());
        }

        return new ArrayList<>(uniqueHashtags);
    }



}
