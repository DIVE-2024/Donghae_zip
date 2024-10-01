//package com.example.donghae_zip.controller;
//
//import com.example.donghae_zip.service.KakaoMapService;
//import com.fasterxml.jackson.databind.JsonNode;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.UnsupportedEncodingException;
//
//@RestController
//@RequestMapping("/api/map")
//public class MapController {
//    private final KakaoMapService kakaoMapService;
//    @Autowired
//    public MapController(KakaoMapService kakaoMapService) {
//        this.kakaoMapService = kakaoMapService;
//    }
//    // 주소를 기반으로 위도, 경도 좌표를 가져오는 메서드
//    @GetMapping("/coordinates")
//    public ResponseEntity<?> getCoordinates(@RequestParam("address") String address) throws UnsupportedEncodingException {
//        JsonNode document = kakaoMapService.getCoordinates(address);
//
//        if (document == null) {
//            return ResponseEntity.status(404).body("Coordinates not found for the given address");
//        }
//
//        double latitude = document.get("y").asDouble();
//        double longitude = document.get("x").asDouble();
//
//        return ResponseEntity.ok()
//                .body(String.format("Latitude: %f, Longitude: %f", latitude, longitude));
//    }
//
//}
