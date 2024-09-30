package com.example.donghae_zip.controller;

import com.example.donghae_zip.service.TrailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TrailController {

    @Autowired
    private TrailService trailService;

    // JSON 파일에서 데이터를 읽어와 데이터베이스에 저장하는 엔드포인트
    @GetMapping("/import-trail")
    public String importTrailData() {
        String filePath = "C:\\Users\\sh980\\workspace\\둘렛길(최종).json";  // JSON 파일 경로
        try {
            trailService.saveTrailFromJson(filePath);
            return "Trail data imported successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error importing trail data: " + e.getMessage();
        }
    }
}
