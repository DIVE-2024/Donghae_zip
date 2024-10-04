package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import com.example.donghae_zip.repository.RestaurantRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private KakaoMapService kakaoMapService;

    // 모든 식당 데이터 가져오기
    public Page<Restaurant> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findAll(pageable);
    }

    // 해시태그 목록 가져오기
    public List<String> getAllHashtags() {
        List<Restaurant> restaurants = restaurantRepository.findAll();

        // 모든 레스토랑의 해시태그를 중복 없이 수집
        Set<String> uniqueHashtags = new HashSet<>();
        for (Restaurant restaurant : restaurants) {
            String tag = restaurant.getHashtag().trim();  // 해시태그의 앞뒤 공백 제거
            if (!tag.isEmpty()) {  // 공백인 해시태그 제외
                uniqueHashtags.add(tag);  // 쉼표를 포함해도 전체 문자열을 그대로 추가
            }
        }

        return new ArrayList<>(uniqueHashtags); // 리스트로 변환 후 반환
    }


    // ID로 특정 식당 데이터 가져오기
    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    // 지역으로 식당 데이터 가져오기 (페이징 처리)
    public Page<Restaurant> getRestaurantsByRegion(Region region, Pageable pageable) {
        return restaurantRepository.findByRegion(region, pageable);
    }

    // 지역에 따른 구/군 목록 가져오기
    public List<String> getDistrictsByRegion(Region region) {
        // 해당 지역의 모든 레스토랑을 찾고, 중복 없이 구/군 목록을 추출
        List<String> districts = restaurantRepository.findDistinctDistrictsByRegion(region);
        return districts; // 구/군 목록 반환
    }


    // 지역과 해시태그로 식당 데이터 가져오기 (페이징 처리)
    public Page<Restaurant> getRestaurantsByRegionAndHashtag(Region region, String hashtag, Pageable pageable) {
        return restaurantRepository.findByRegionAndHashtagContaining(region, hashtag, pageable);
    }

    // 해시태그로 식당 데이터 가져오기 (페이징 처리)
    public Page<Restaurant> getRestaurantsByHashtag(String hashtag, Pageable pageable) {
        return restaurantRepository.findByHashtag(hashtag, pageable);
    }

    // 지역과 구/군, 해시태그로 식당 데이터 가져오기
    public Page<Restaurant> getRestaurantsByRegionAndDistrictAndHashtag(Region region, String district, String hashtag, Pageable pageable) {
        return restaurantRepository.findByRegionAndDistrictAndHashtagContaining(region, district, hashtag, pageable);
    }

    // 지역과 구/군으로 식당 데이터 가져오기
    public Page<Restaurant> getRestaurantsByRegionAndDistrict(Region region, String district, Pageable pageable) {
        return restaurantRepository.findByRegionAndDistrict(region, district, pageable);
    }

    // 주소 기반으로 식당의 경도와 위도 업데이트
    public boolean updateCoordinatesByAddress(Long restaurantId) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(restaurantId);

        if (optionalRestaurant.isPresent()) {
            Restaurant restaurant = optionalRestaurant.get();

            try {
                JsonNode coordinates = kakaoMapService.getCoordinates(restaurant.getAddress());

                if (coordinates != null && coordinates.has("y") && coordinates.has("x")) {
                    double latitude = coordinates.get("y").asDouble();
                    double longitude = coordinates.get("x").asDouble();

                    // Restaurant 엔티티에 좌표 정보 업데이트
                    restaurant.setLatitude(latitude);
                    restaurant.setLongitude(longitude);
                    restaurantRepository.save(restaurant);
                    return true; // 성공적으로 업데이트된 경우 true 반환
                }
            } catch (Exception e) {
                e.printStackTrace(); // 예외 발생 시 로그 출력
            }
        }
        return false; // 업데이트 실패한 경우 false 반환
    }

    // 모든 식당 데이터에 대한 경위도 업데이트
    public void updateAllRestaurantCoordinates() {
        List<Restaurant> restaurants = restaurantRepository.findAll();

        for (Restaurant restaurant : restaurants) {
            if (restaurant.getAddress() != null && !restaurant.getAddress().isEmpty()) {
                try {
                    JsonNode coordinates = kakaoMapService.getCoordinates(restaurant.getAddress());

                    if (coordinates != null && coordinates.has("y") && coordinates.has("x")) {
                        double latitude = coordinates.get("y").asDouble();
                        double longitude = coordinates.get("x").asDouble();

                        // Restaurant 엔티티에 좌표 정보 업데이트
                        restaurant.setLatitude(latitude);
                        restaurant.setLongitude(longitude);
                        restaurantRepository.save(restaurant);
                    }
                } catch (Exception e) {
                    e.printStackTrace(); // 예외 발생 시 로그 출력
                }
            }
        }
    }


    // 찜이 많은 수로 레스토랑을 정렬
    public Page<Restaurant> getRestaurantsSortedByFavorites(Pageable pageable) {
        return restaurantRepository.findRestaurantsOrderByFavoritesCount(pageable);

    public Map<String, Map<String, Object>> getTopRestaurantsByRegionAndHashtag(Region region, int limit) {
        Map<String, Map<String, Object>> hashtagMap = new HashMap<>();

        // 모든 해시태그를 가져와서 처리
        List<String> hashtags = getAllHashtags(); // 이미 존재하는 해시태그 목록 가져오기 메서드 사용

        for (String hashtag : hashtags) {
            // 해시태그와 지역에 따른 모든 식당 개수 가져오기
            int totalRestaurants = restaurantRepository.countByRegionAndHashtag(region, hashtag);

            // 상위 n개의 음식점을 해시태그와 지역에 따라 가져오기
            Pageable pageable = PageRequest.of(0, limit);
            List<Restaurant> topRestaurants = restaurantRepository.findTop5ByRegionAndHashtag(region, hashtag, pageable);

            // 가져온 음식점 목록이 있으면 해시태그로 매핑
            if (!topRestaurants.isEmpty()) {
                Map<String, Object> data = new HashMap<>();
                data.put("totalRestaurants", totalRestaurants);  // 전체 식당 개수
                data.put("restaurants", topRestaurants);  // 상위 5개의 식당 목록
                hashtagMap.put(hashtag, data);
            }
        }
        return hashtagMap;  // 해시태그 별로 그룹화된 맵 반환
    }


    public Page<Restaurant> getAllRestaurantsByRegionAndHashtag(Region region, String hashtag, Pageable pageable) {
        return restaurantRepository.findAllByRegionAndHashtag(region, hashtag, pageable);
    }




}
