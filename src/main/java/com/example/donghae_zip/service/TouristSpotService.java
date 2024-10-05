package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.TouristSpot;
import com.example.donghae_zip.repository.TouristSpotRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class TouristSpotService {

    @Autowired
    private TouristSpotRepository touristSpotRepository;

    // 전체 관광지 조회 (페이지네이션 적용)
    public Page<TouristSpot> getAllTouristSpots(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return touristSpotRepository.findAll(pageable);
    }

    // 다중 조건 필터 검색
    public Page<TouristSpot> searchSpots(String title, String region, String indoorOutdoor, String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return touristSpotRepository.findByTitleContainingAndRegionContainingAndIndoorOutdoorContainingAndPlaceCategoryContaining(
                title != null ? title : "",
                region != null ? region : "",
                indoorOutdoor != null ? indoorOutdoor : "",
                category != null ? category : "",
                pageable);
    }

    // 제목으로 검색 (페이지네이션 적용)
    public Page<TouristSpot> searchByTitle(String title, Pageable pageable) {
        return touristSpotRepository.findByTitleContaining(title, pageable);
    }

    // 지역으로 검색 (페이지네이션 적용)
    public Page<TouristSpot> searchByRegion(String region, Pageable pageable) {
        return touristSpotRepository.findByRegionContaining(region, pageable);
    }

    // 태그로 검색 (여러 태그를 동시에 검색 가능, 페이지네이션 적용)
    public Page<TouristSpot> searchByTags(List<String> tags, Pageable pageable) {
        return touristSpotRepository.findByTagsIn(tags, pageable);
    }

    // 카테고리 목록에 따라 필터링 (페이지네이션 포함)
    public Page<TouristSpot> getSpotsByCategories(List<String> categories, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return touristSpotRepository.findByPlaceCategoryIn(categories, pageable);
    }

    // 실내 장소만 가져오는 메소드 (페이지네이션)
    public Page<TouristSpot> getIndoorSpots(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return touristSpotRepository.findByIndoorOutdoor("실내", pageable);
    }

    // 실외 장소만 가져오는 메소드 (페이지네이션)
    public Page<TouristSpot> getOutdoorSpots(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return touristSpotRepository.findByIndoorOutdoor("실외", pageable);
    }

    // ID로 여행지 정보 조회
    public TouristSpot getTouristSpotById(Long id) {
        return touristSpotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No tourist spot found with ID: " + id));
    }

    // 여행지 추가 (관리자 기능)
    public TouristSpot createTouristSpot(TouristSpot touristSpot) {
        return touristSpotRepository.save(touristSpot);
    }

    // 여행지 수정 (관리자 기능)
    public TouristSpot updateTouristSpot(Long id, TouristSpot updatedSpot) {
        TouristSpot spot = getTouristSpotById(id);  // 기존 데이터 조회
        spot.setTitle(updatedSpot.getTitle());
        spot.setAddress(updatedSpot.getAddress());
        spot.setPlaceCategory(updatedSpot.getPlaceCategory());
        // 나머지 필드들도 수정
        return touristSpotRepository.save(spot);
    }

    // 여행지 삭제 (관리자 기능)
    public void deleteTouristSpot(Long id) {
        touristSpotRepository.deleteById(id);
    }

    // Json 파일로부터 여행지 데이터를 저장하는 메소드
    @Transactional
    public void saveTouristSpotFromJson(String filePath) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(new File(filePath));

        for (JsonNode node : rootNode) {
            String title = Optional.ofNullable(node.get("title")).map(JsonNode::asText).orElse("No Title");

            // 중복 체크 (여기서는 제목으로 체크하지만, 다른 고유 식별자가 있다면 그걸로 확인할 수 있음)
            if (touristSpotRepository.existsByTitle(title)) {
                System.out.println("Tourist spot already exists: " + title);
                continue;  // 이미 존재하면 저장하지 않고 넘어감
            }

            // 새로 저장할 객체 생성
            TouristSpot touristSpot = new TouristSpot();
            touristSpot.setTitle(title);
            touristSpot.setAddress(Optional.ofNullable(node.get("address")).map(JsonNode::asText).orElse("No Address"));
            touristSpot.setPlaceCategory(Optional.ofNullable(node.get("Place Category")).map(JsonNode::asText).orElse("Unknown"));
            touristSpot.setOneLineDesc(Optional.ofNullable(node.get("one_line_desc")).map(JsonNode::asText).orElse("No Description"));
            touristSpot.setDetailedInfo(Optional.ofNullable(node.get("detailed_info")).map(JsonNode::asText).orElse("No Info"));
            touristSpot.setLongitude(Optional.ofNullable(node.get("coordinates")).map(coord -> coord.get("longitude").asText()).orElse(null));
            touristSpot.setLatitude(Optional.ofNullable(node.get("coordinates")).map(coord -> coord.get("latitude").asText()).orElse(null));
            touristSpot.setRegion(Optional.ofNullable(node.get("region")).map(JsonNode::asText).orElse("No Region"));
            touristSpot.setIndoorOutdoor(Optional.ofNullable(node.get("indoor_outdoor")).map(JsonNode::asText).orElse("Unknown"));

            // 이미지 URL 목록
            List<String> imageUrls = Optional.ofNullable(objectMapper.convertValue(node.get("image_urls"), List.class)).orElse(List.of());
            touristSpot.setImageUrls(imageUrls);

            // contact_info 처리
            Map<String, String> contactInfo = Optional.ofNullable(objectMapper.convertValue(node.get("contact_info"), Map.class)).orElse(Map.of());
            touristSpot.setContactInfo(contactInfo);

            // tags 처리
            List<String> tags = Optional.ofNullable(objectMapper.convertValue(node.get("tags"), List.class)).orElse(List.of());
            touristSpot.setTags(tags);

            touristSpotRepository.save(touristSpot);
        }
    }

    public Page<TouristSpot> getTouristSpotsWithinRadius(double latitude, double longitude, double radius, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return touristSpotRepository.findTouristSpotsWithinRadius(latitude, longitude, radius, pageable);
    }

    public Page<TouristSpot> getTouristSpotsWithinRadiusAndCategory(double latitude, double longitude, double radius, String placeCategory, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (placeCategory != null && !placeCategory.isEmpty()) {
            return touristSpotRepository.findTouristSpotsWithinRadiusAndCategory(latitude, longitude, radius, placeCategory, pageable);
        } else {
            return touristSpotRepository.findTouristSpotsWithinRadius(latitude, longitude, radius, pageable);
        }
    }

    // 특정 좌표와 반경 내에서 고유한 카테고리 목록을 가져오는 메소드
    public List<String> getDistinctPlaceCategoriesWithinRadius(double latitude, double longitude, double radius) {
        return touristSpotRepository.findDistinctPlaceCategoriesWithinRadius(latitude, longitude, radius);
    }

}
