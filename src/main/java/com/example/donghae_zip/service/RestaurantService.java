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
        List<String> districts = restaurantRepository.findDistinctDistrictsByRegion(region);
        return districts;
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
    }

    // 지역과 해시태그로 상위 레스토랑 가져오기
    public Map<String, Map<String, Object>> getTopRestaurantsByRegionAndHashtag(Region region, int limit) {
        Map<String, Map<String, Object>> hashtagMap = new HashMap<>();

        // 모든 해시태그를 가져와서 처리
        List<String> hashtags = getAllHashtags();

        for (String hashtag : hashtags) {
            // 해시태그와 지역에 따른 모든 식당 개수 가져오기
            int totalRestaurants = restaurantRepository.countByRegionAndHashtag(region, hashtag);

            // 상위 n개의 음식점을 해시태그와 지역에 따라 가져오기
            Pageable pageable = PageRequest.of(0, limit);
            List<Restaurant> topRestaurants = restaurantRepository.findTop5ByRegionAndHashtag(region, hashtag, pageable);

            if (!topRestaurants.isEmpty()) {
                Map<String, Object> data = new HashMap<>();
                data.put("totalRestaurants", totalRestaurants);
                data.put("restaurants", topRestaurants);
                hashtagMap.put(hashtag, data);
            }
        }
        return hashtagMap;
    }

    public Page<Restaurant> getAllRestaurantsByRegionAndHashtag(Region region, String hashtag, Pageable pageable) {
        return restaurantRepository.findAllByRegionAndHashtag(region, hashtag, pageable);
    }

    // 좌표와 반경을 기반으로 식당 검색
    public Page<Restaurant> getRestaurantsWithinRadius(double latitude, double longitude, double radius, Pageable pageable) {
        return restaurantRepository.findRestaurantsWithinRadius(latitude, longitude, radius, pageable);
    }

    // 좌표와 반경, 해시태그로 식당 검색
    public Page<Restaurant> getRestaurantsWithinRadiusAndHashtag(double latitude, double longitude, double radius, String hashtag, Pageable pageable) {
        return restaurantRepository.findRestaurantsWithinRadiusAndHashtag(latitude, longitude, radius, hashtag, pageable);
    }

    // 특정 좌표와 반경, 카테고리 내의 식당 데이터 가져오는 메서드
    public Page<Restaurant> getRestaurantsWithinRadiusAndCategory(double latitude, double longitude, double radius, String category, Pageable pageable) {
        // Repository에서 경위도와 반경, 카테고리를 기준으로 식당 데이터를 조회
        return restaurantRepository.findRestaurantsWithinRadiusAndCategory(latitude, longitude, radius, category, pageable);
    }

}
