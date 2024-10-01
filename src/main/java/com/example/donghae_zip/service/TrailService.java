package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Trail;
import com.example.donghae_zip.repository.TrailRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.List;

@Service
public class TrailService {

    @Autowired
    private TrailRepository trailRepository;

    @Transactional
    public void saveTrailFromJson(String filePath) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(new File(filePath));

        for (JsonNode node : rootNode) {
            String courseName = node.get("course_name").asText();

            // 중복 체크: 코스명이 이미 존재하는지 확인
            if (trailRepository.existsByCourseName(courseName)) {
                continue; // 중복된 데이터는 저장하지 않음
            }

            Trail trail = new Trail();
            trail.setCourseName(courseName);
            List<String> imageUrls = objectMapper.convertValue(node.get("image_urls"), List.class);
            trail.setImageUrls(imageUrls);
            trail.setStartPoint(node.get("start_end_points").get("start_point").asText());
            trail.setEndPoint(node.get("start_end_points").get("end_point").asText());
            trail.setCourseIntro(node.get("course_intro").get("course_intro").asText());
            trail.setCourseOverview(node.get("course_intro").get("course_overview").asText());
            trail.setTouristPoints(node.get("course_intro").get("tourist_points").asText());

            if (node.get("course_intro").has("travel_info")) {
                trail.setTravelInfo(node.get("course_intro").get("travel_info").asText());
            }

            if (node.has("gpx_path")) {
                trail.setGpxPath(node.get("gpx_path").asText());
            }

            trail.setLength(node.get("length").asText());
            trail.setTime(node.get("time").asText());
            trail.setDifficulty(node.get("difficulty").asText());
            trail.setLengthInKm(node.get("length_in_km").asDouble());
            trail.setTimeInMinutes(node.get("time_in_minutes").asInt());

            trailRepository.save(trail);
        }
    }
}
