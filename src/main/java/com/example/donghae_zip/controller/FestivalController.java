package com.example.donghae_zip.controller;

import com.example.donghae_zip.service.FestivalService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/festivals")
public class FestivalController {

    @Autowired
    private FestivalService festivalService;

    @PostMapping("/load")
    public ResponseEntity<String> loadFestivalsFromJson(@RequestBody String filePath) {
        try {
            festivalService.saveFestivalFromJson(filePath);
            return ResponseEntity.ok("Festivals loaded successfully");
        } catch (Exception e) {
            // 예외 발생 시 적절한 에러 메시지를 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error loading festivals: " + e.getMessage());
        }
    }
}