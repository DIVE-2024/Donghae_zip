package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.TouristSpot;
import com.example.donghae_zip.repository.TouristSpotRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class TouristSpotService {

    @Autowired
    private TouristSpotRepository touristSpotRepository;

    @Transactional
    public void saveTouristSpotFromJson(String filePath) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(new File(filePath));

        for (JsonNode node : rootNode) {
            // placeCategory가 null이면 해당 데이터는 저장하지 않도록 함
            JsonNode placeCategoryNode = node.get("Place Category");
            if (placeCategoryNode == null || placeCategoryNode.asText().isEmpty()) {
                continue; // placeCategory가 없으면 저장하지 않음
            }

            TouristSpot touristSpot = new TouristSpot();

            // 필드들이 null인 경우 기본값을 할당
            touristSpot.setTitle(Optional.ofNullable(node.get("title")).map(JsonNode::asText).orElse("No Title"));
            touristSpot.setAddress(Optional.ofNullable(node.get("address")).map(JsonNode::asText).orElse("No Address"));

            // placeCategory 설정
            touristSpot.setPlaceCategory(placeCategoryNode.asText());

            touristSpot.setOneLineDesc(Optional.ofNullable(node.get("one_line_desc")).map(JsonNode::asText).orElse("No Description"));
            touristSpot.setDetailedInfo(Optional.ofNullable(node.get("detailed_info")).map(JsonNode::asText).orElse("No Info"));

            // 좌표 정보 처리
            touristSpot.setLongitude(Optional.ofNullable(node.get("coordinates"))
                    .map(coord -> coord.get("longitude").asText()).orElse(null));
            touristSpot.setLatitude(Optional.ofNullable(node.get("coordinates"))
                    .map(coord -> coord.get("latitude").asText()).orElse(null));

            touristSpot.setRegion(Optional.ofNullable(node.get("region")).map(JsonNode::asText).orElse("No Region"));
            touristSpot.setIndoorOutdoor(Optional.ofNullable(node.get("indoor_outdoor")).map(JsonNode::asText).orElse("Unknown"));

            // 이미지 URL 목록 처리
            List<String> imageUrls = Optional.ofNullable(objectMapper.convertValue(node.get("image_urls"), List.class)).orElse(List.of());
            touristSpot.setImageUrls(imageUrls);

            // contact_info 처리 (유연한 필드)
            Map<String, String> contactInfo = Optional.ofNullable(objectMapper.convertValue(node.get("contact_info"), Map.class))
                    .orElse(Map.of());
            touristSpot.setContactInfo(contactInfo);

            // tags 처리
            List<String> tags = Optional.ofNullable(objectMapper.convertValue(node.get("tags"), List.class)).orElse(List.of());
            touristSpot.setTags(tags);

            // 관광 정보 저장
            touristSpotRepository.save(touristSpot);
        }
    }

}
