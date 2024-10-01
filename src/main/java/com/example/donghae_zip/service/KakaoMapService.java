package com.example.donghae_zip.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

@Service
public class KakaoMapService {

    private static final Logger logger = LoggerFactory.getLogger(KakaoMapService.class);

    private final WebClient webClient;

    // application.properties 또는 환경 변수에서 Kakao API Key를 가져옵니다.
    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    public KakaoMapService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://dapi.kakao.com").build();
    }

    // 주소를 받아 좌표 정보를 가져오는 메서드
    public JsonNode getCoordinates(String address) {
        try {
            String response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/local/search/address.json")
                            .queryParam("query", address)
                            .build())
                    .header("Authorization", "KakaoAK " + kakaoApiKey.trim())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // 블로킹 방식으로 동기 처리

            logger.info("Kakao API 응답 내용: " + response);

            // 응답 JSON 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonResponse = objectMapper.readTree(response);

            // 응답에서 좌표 정보 추출 및 반환
            if (jsonResponse != null && jsonResponse.has("documents") && jsonResponse.get("documents").size() > 0) {
                return jsonResponse.get("documents").get(0); // 첫 번째 결과를 반환
            } else {
                logger.warn("Kakao API 응답에서 좌표 정보를 찾을 수 없습니다.");
                return null;
            }
        } catch (Exception e) {
            logger.error("Kakao API 호출 오류: ", e);
            return null;
        }
    }
}
