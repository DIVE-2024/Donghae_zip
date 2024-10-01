package com.example.donghae_zip.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

//ApiClient 클래스를 구현하여 Kakao Map API와 통신하는 기능
@Component
public class ApiClient {

    private final RestTemplate restTemplate;

    @Value("${KAKAO_REST_API_KEY}")
    private String kakaoRestApiKey;

    public ApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // 숙박/식당 주소를 통해 Kakao Map API에 요청을 보내고 좌표 정보를 가져오는 메서드
    public String getCoordinatesByAddress(String address) {
        URI uri = UriComponentsBuilder
                .fromUriString("https://dapi.kakao.com")
                .path("/v2/local/search/address.json")
                .queryParam("query", address)
                .build()
                .toUri();

        // Kakao Map API 요청 시 필요한 인증 헤더 설정
        var headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoRestApiKey);

        var entity = new org.springframework.http.HttpEntity<>(headers);

        // API 호출 및 응답 처리
        var response = restTemplate.exchange(uri, org.springframework.http.HttpMethod.GET, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody(); // 응답 JSON 문자열 반환
        } else {
            throw new RuntimeException("Failed to fetch coordinates from Kakao API");
        }
    }
}
