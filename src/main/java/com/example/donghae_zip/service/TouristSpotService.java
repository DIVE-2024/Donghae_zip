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

    // 통합 검색 메소드 (제목, 카테고리, 지역, 태그로 검색)
    public Page<TouristSpot> searchSpots(String title, String category, String region, String tag, Pageable pageable) {
        return touristSpotRepository.findByTitleContainingAndPlaceCategoryContainingAndRegionContainingAndTagsContaining(
                title != null ? title : "",
                category != null ? category : "",
                region != null ? region : "",
                tag != null ? tag : "",
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
            JsonNode placeCategoryNode = node.get("Place Category");
            if (placeCategoryNode == null || placeCategoryNode.asText().isEmpty()) {
                continue;
            }

            TouristSpot touristSpot = new TouristSpot();

            touristSpot.setTitle(Optional.ofNullable(node.get("title")).map(JsonNode::asText).orElse("No Title"));
            touristSpot.setAddress(Optional.ofNullable(node.get("address")).map(JsonNode::asText).orElse("No Address"));
            touristSpot.setPlaceCategory(placeCategoryNode.asText());
            touristSpot.setOneLineDesc(Optional.ofNullable(node.get("one_line_desc")).map(JsonNode::asText).orElse("No Description"));
            touristSpot.setDetailedInfo(Optional.ofNullable(node.get("detailed_info")).map(JsonNode::asText).orElse("No Info"));

            // 좌표 정보
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
}
