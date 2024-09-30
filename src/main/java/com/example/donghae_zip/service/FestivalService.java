package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Festival;
import com.example.donghae_zip.domain.FestivalStatus;
import com.example.donghae_zip.repository.FestivalRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;

@Service
public class FestivalService {

    @Autowired
    private FestivalRepository festivalRepository;

    @Transactional
    public void saveFestivalFromJson(String filePath) throws Exception {
        // ObjectMapper를 사용해 JSON 파일을 읽어옴
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(new File(filePath));

        for (JsonNode node : rootNode) {
            String title = node.has("title") ? node.get("title").asText() : null;
            String period = node.has("details") && node.get("details").has("축제 기간")
                    ? node.get("details").get("축제 기간").asText()
                    : null;

            // 중복 체크: 제목과 기간이 모두 일치하는 데이터가 있는지 확인
            if (title != null && period != null && festivalRepository.existsByTitleAndPeriod(title, period)) {
                continue; // 중복된 데이터는 저장하지 않음
            }

            Festival festival = new Festival();
            festival.setTitle(title);

            // 이미지 목록을 처리
            List<String> images = node.has("images")
                    ? objectMapper.convertValue(node.get("images"), List.class)
                    : null;
            festival.setImages(images);

            // 주소, 문의처 등 nullable 필드들 처리
            festival.setAddress(node.has("details") && node.get("details").has("주소")
                    ? node.get("details").get("주소").asText(null)
                    : null);
            festival.setContact(node.has("details") && node.get("details").has("문의처")
                    ? node.get("details").get("문의처").asText(null)
                    : null);
            festival.setPeriod(period);
            festival.setLocation(node.has("details") && node.get("details").has("장소")
                    ? node.get("details").get("장소").asText(null)
                    : null);
            festival.setHomepage(node.has("details") && node.get("details").has("홈페이지")
                    ? node.get("details").get("홈페이지").asText(null)
                    : null);
            festival.setDate(node.has("date") ? node.get("date").asText() : null);
            festival.setRegion(node.has("region") ? node.get("region").asText() : null);

            // 축제 상태: 기본값은 PENDING으로 설정
            festival.setStatus(FestivalStatus.PENDING);

            // Festival 데이터를 DB에 저장
            festivalRepository.save(festival);
        }
    }
}
