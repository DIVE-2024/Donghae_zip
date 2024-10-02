//package com.example.donghae_zip.dataLoader;
//
//import com.example.donghae_zip.service.FestivalService;
//import com.example.donghae_zip.service.TouristSpotService;
//import com.example.donghae_zip.service.TrailService;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.io.File;
//
//@Component
//public class DataLoader implements CommandLineRunner {
//
//    @Autowired
//    private TrailService trailService;
//
//    @Autowired
//    private FestivalService festivalService;
//
//    @Autowired
//    private TouristSpotService touristSpotService;
//
//    @Override
//    public void run(String... args) throws Exception {
//        // 둘렛길 데이터 로드
//        loadTrailData();
//
//        // 축제 데이터 로드
//        loadFestivalData();
//
//        // 여행지 데이터를 로드
//        loadTouristSpotData();
//    }
//
//    private void loadTrailData() throws Exception {
//        // 둘렛길(최종) 파일 경로 설정
//        File trailFile = new File("C:\\히껑\\DIVE2024\\둘렛길(최종).json");
//
//        // 둘렛길 데이터 저장 서비스 호출
//        trailService.saveTrailFromJson(trailFile.getAbsolutePath());
//    }
//
//    private void loadFestivalData() throws Exception {
//        // 축제(최종) 파일 경로 설정
//        File festivalFile = new File("C:\\히껑\\DIVE2024\\축제(최종).json");
//
//        // 축제 데이터 저장 서비스 호출
//        festivalService.saveFestivalFromJson(festivalFile.getAbsolutePath());
//    }
//
//    private void loadTouristSpotData() throws Exception {
//        String touristSpotFilePath = "C:\\히껑\\DIVE2024\\여행지(최종).json";
//        touristSpotService.saveTouristSpotFromJson(touristSpotFilePath);
//    }
//}