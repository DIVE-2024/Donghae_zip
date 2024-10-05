package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.*;
import com.example.donghae_zip.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Favorites", description = "사용자의 찜 목록 관리 API")
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Operation(summary = "관광지 찜 추가", description = "특정 사용자가 선택한 관광지를 찜 목록에 추가합니다.")
    @PostMapping("/auth/spots/{spotId}")
    public ResponseEntity<Favorite> addFavoriteSpot(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "관광지 ID", required = true) @PathVariable Long spotId) {
        Favorite favorite = favoriteService.addFavoriteSpot(userId, spotId);
        return ResponseEntity.ok(favorite);
    }

    @Operation(summary = "관광지 찜 삭제", description = "특정 사용자가 선택한 관광지를 찜 목록에서 삭제합니다.")
    @DeleteMapping("/auth/spots/{spotId}")
    public ResponseEntity<Void> removeFavoriteSpot(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "관광지 ID", required = true) @PathVariable Long spotId) {
        favoriteService.removeFavoriteSpot(userId, spotId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "숙박시설 찜 추가", description = "특정 사용자가 선택한 숙박시설을 찜 목록에 추가합니다.")
    @PostMapping("/auth/accommodations/{accommodationId}")
    public ResponseEntity<Favorite> addFavoriteAccommodation(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "숙박시설 ID", required = true) @PathVariable Long accommodationId) {
        Favorite favorite = favoriteService.addFavoriteAccommodation(userId, accommodationId);
        return ResponseEntity.ok(favorite);
    }

    @Operation(summary = "숙박시설 찜 삭제", description = "특정 사용자가 선택한 숙박시설을 찜 목록에서 삭제합니다.")
    @DeleteMapping("/auth/accommodations/{accommodationId}")
    public ResponseEntity<Void> removeFavoriteAccommodation(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "숙박시설 ID", required = true) @PathVariable Long accommodationId) {
        favoriteService.removeFavoriteAccommodation(userId, accommodationId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "음식점 찜 추가", description = "특정 사용자가 선택한 음식점을 찜 목록에 추가합니다.")
    @PostMapping("/auth/restaurants/{restaurantId}")
    public ResponseEntity<Favorite> addFavoriteRestaurant(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "음식점 ID", required = true) @PathVariable Long restaurantId) {
        Favorite favorite = favoriteService.addFavoriteRestaurant(userId, restaurantId);
        return ResponseEntity.ok(favorite);
    }

    @Operation(summary = "음식점 찜 삭제", description = "특정 사용자가 선택한 음식점을 찜 목록에서 삭제합니다.")
    @DeleteMapping("/auth/restaurants/{restaurantId}")
    public ResponseEntity<Void> removeFavoriteRestaurant(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "음식점 ID", required = true) @PathVariable Long restaurantId) {
        favoriteService.removeFavoriteRestaurant(userId, restaurantId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "둘레길 찜 추가", description = "특정 사용자가 선택한 둘레길을 찜 목록에 추가합니다.")
    @PostMapping("/auth/trails/{trailId}")
    public ResponseEntity<Favorite> addFavoriteTrail(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "둘레길 ID", required = true) @PathVariable Long trailId) {
        Favorite favorite = favoriteService.addFavoriteTrail(userId, trailId);
        return ResponseEntity.ok(favorite);
    }

    @Operation(summary = "둘레길 찜 삭제", description = "특정 사용자가 선택한 둘레길을 찜 목록에서 삭제합니다.")
    @DeleteMapping("/auth/trails/{trailId}")
    public ResponseEntity<Void> removeFavoriteTrail(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "둘레길 ID", required = true) @PathVariable Long trailId) {
        favoriteService.removeFavoriteTrail(userId, trailId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "찜한 모든 장소 조회", description = "특정 사용자가 찜한 모든 장소를 페이지네이션으로 조회합니다.")
    @GetMapping("/auth")
    public ResponseEntity<Page<Favorite>> getFavoriteSpots(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam int size) {
        Page<Favorite> favorites = favoriteService.getFavoriteSpots(userId, page, size);
        return ResponseEntity.ok(favorites);
    }

    @Operation(summary = "찜한 관광지 조회", description = "특정 사용자가 찜한 관광지를 페이지네이션으로 조회합니다.")
    @GetMapping("/auth/tourist-spots/{userId}")
    public ResponseEntity<Page<Favorite>> getFavoriteTouristSpots(
            @Parameter(description = "사용자 ID", required = true) @PathVariable Long userId,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam int size) {
        Page<Favorite> favorites = favoriteService.getFavoriteTouristSpots(userId, page, size);
        return ResponseEntity.ok(favorites);
    }

    @Operation(summary = "찜한 숙박시설 조회", description = "특정 사용자가 찜한 숙박시설을 페이지네이션으로 조회합니다.")
    @GetMapping("/auth/accommodations/{userId}")
    public ResponseEntity<Page<Favorite>> getFavoriteAccommodations(
            @Parameter(description = "사용자 ID", required = true) @PathVariable Long userId,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam int size) {
        Page<Favorite> favorites = favoriteService.getFavoriteAccommodations(userId, page, size);
        return ResponseEntity.ok(favorites);
    }

    @Operation(summary = "찜한 음식점 조회", description = "특정 사용자가 찜한 음식점을 페이지네이션으로 조회합니다.")
    @GetMapping("/auth/restaurants/{userId}")
    public ResponseEntity<Page<Favorite>> getFavoriteRestaurants(
            @Parameter(description = "사용자 ID", required = true) @PathVariable Long userId,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam int page,
            @Parameter(description = "페이지당 항목 수", example = "10") @RequestParam int size) {
        Page<Favorite> favorites = favoriteService.getFavoriteRestaurants(userId, page, size);
        return ResponseEntity.ok(favorites);
    }

    @Operation(summary = "찜한 둘레길 조회", description = "특정 사용자가 찜한 둘레길을 페이지네이션으로 조회합니다.")
    @GetMapping("/auth/trails/{userId}")
    public ResponseEntity<Page<Favorite>> getFavoriteTrails(
            @PathVariable Long userId,
            @RequestParam int page,
            @RequestParam int size) {

        Page<Favorite> favorites = favoriteService.getFavoriteTrails(userId, page, size);
        return ResponseEntity.ok(favorites);
    }


    @Operation(summary = "협업 필터링을 통한 여행지 추천", description = "사용자 기반 협업 필터링(사용자와 비슷한 찜을 한 상위 5명 사용자의 찜)을 통해 추천된 여행지를 페이지네이션으로 조회합니다.")
    @GetMapping("/auth/recommend")
    public ResponseEntity<Page<TouristSpot>> recommendSpots(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "페이지 정보", required = true) Pageable pageable) {
        Page<TouristSpot> recommendedSpots = favoriteService.recommendSpots(userId, pageable);
        return ResponseEntity.ok(recommendedSpots);
    }

    @Operation(summary = "유사 카테고리 여행지 추천", description = "사용자가 찜한 여행지와 유사한 카테고리의 여행지를 페이지네이션으로 추천합니다.")
    @GetMapping("/auth/recommend-by-category")
    public ResponseEntity<Page<TouristSpot>> recommendSpotsByCategory(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "페이지 정보", required = true) Pageable pageable) {
        Page<TouristSpot> recommendedSpots = favoriteService.recommendSpotsByCategory(userId, pageable);
        return ResponseEntity.ok(recommendedSpots);
    }

    @Operation(summary = "나이대별 인기 여행지 조회 (페이징 처리)", description = "10대부터 80대까지의 나이대별로 찜이 많은 인기 여행지를 페이징 처리하여 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 나이대별 인기 여행지 조회",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/popular-by-age-group")
    public ResponseEntity<Map<String, Page<TouristSpot>>> getPopularSpotsByAgeGroups(
            @Parameter(description = "페이지 정보", required = true) Pageable pageable) {
        Map<String, Page<TouristSpot>> popularSpots = favoriteService.getPopularSpotsByAllAgeGroups(pageable);
        return ResponseEntity.ok(popularSpots);
    }

    @Operation(summary = "해시태그 기반 레스토랑 추천", description = "사용자가 찜한 레스토랑의 해시태그를 분석하여 유사한 레스토랑을 추천합니다.")
    @GetMapping("/recommend-restaurants-by-hashtag")
    public ResponseEntity<Page<Restaurant>> recommendRestaurantsByHashtag(
            @RequestParam Long userId,
            @PageableDefault(page = 0, size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Restaurant> recommendedRestaurants = favoriteService.recommendRestaurantsByHashtag(userId, pageable);
        return ResponseEntity.ok(recommendedRestaurants);
    }

    @Operation(summary = "찜이 많은 관광지 조회", description = "찜이 많은 순서대로 관광지 목록을 페이지네이션으로 조회합니다.")
    @GetMapping("/public/popular-tourist-spots")
    public ResponseEntity<Page<TouristSpot>> getPopularTouristSpots(
            @ParameterObject @PageableDefault(sort = "touristSpot", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<TouristSpot> popularSpots = favoriteService.getPopularTouristSpots(pageable);
        return ResponseEntity.ok(popularSpots);
    }

    @Operation(summary = "찜이 많은 숙박시설 조회", description = "찜이 많은 순서대로 숙박시설 목록을 페이지네이션으로 조회합니다.")
    @GetMapping("/public/popular-accommodations")
    public ResponseEntity<Page<Accommodation>> getPopularAccommodations(
            @ParameterObject @PageableDefault(sort = "accommodation", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Accommodation> popularAccommodations = favoriteService.getPopularAccommodations(pageable);
        return ResponseEntity.ok(popularAccommodations);
    }

    @Operation(summary = "찜이 많은 음식점 조회", description = "찜이 많은 순서대로 음식점 목록을 페이지네이션으로 조회합니다.")
    @GetMapping("/public/popular-restaurants")
    public ResponseEntity<Page<Restaurant>> getPopularRestaurants(
            @ParameterObject @PageableDefault(sort = "restaurant", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Restaurant> popularRestaurants = favoriteService.getPopularRestaurants(pageable);
        return ResponseEntity.ok(popularRestaurants);
    }

    @Operation(summary = "찜이 많은 둘레길 조회", description = "찜이 많은 순서대로 둘레길 목록을 페이지네이션으로 조회합니다.")
    @GetMapping("/popular-trails")
    public ResponseEntity<Page<Trail>> getPopularTrails(
            @ParameterObject @PageableDefault(size = 10, sort = "trail", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Trail> popularTrails = favoriteService.getPopularTrails(pageable);
        return ResponseEntity.ok(popularTrails);
    }
}