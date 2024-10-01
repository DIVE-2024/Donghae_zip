package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Region;
import com.example.donghae_zip.domain.Restaurant;
import com.example.donghae_zip.repository.RestaurantRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private KakaoMapService kakaoMapService;

    // 모든 식당 데이터 가져오기
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    // ID로 특정 식당 데이터 가져오기
    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    // 지역과 해시태그로 식당 데이터 가져오기
    public List<Restaurant> getRestaurantsByRegionAndHashtag(Region region, String hashtag) {
        return restaurantRepository.findByRegionAndHashtagContaining(region, hashtag);
    }

    // 해시태그로 식당 데이터 가져오기
    public List<Restaurant> getRestaurantsByHashtag(String hashtag) {
        return restaurantRepository.findByHashtag(hashtag);
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


}
