package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Trail;
import com.example.donghae_zip.repository.TrailRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.List;

@Service
public class TrailService {

    @Autowired
    private TrailRepository trailRepository;

    // 전체 둘레길 조회
    public Page<Trail> getAllTrails(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return trailRepository.findAll(pageable);
    }

    // ID로 둘레길 조회
    public Trail getTrailById(Long id) {
        return trailRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No trail found with ID: " + id));
    }

    // 둘레길 제목으로 검색 (페이지네이션 적용)
    public Page<Trail> searchByTitle(String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return trailRepository.findByCourseNameContaining(title, pageable);
    }

    // 난이도로 검색 (페이지네이션 적용)
    public Page<Trail> searchByDifficulty(String difficulty, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return trailRepository.findByDifficultyContaining(difficulty, pageable);
    }


    // 소요시간으로 정렬된 둘레길 목록을 페이지네이션과 함께 반환
    // 소요시간으로 정렬된 둘레길 목록을 반환
    public Page<Trail> getTrailsSortedByTime(String direction, int page, int size) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by("timeInMinutes").ascending() : Sort.by("timeInMinutes").descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return trailRepository.findAll(pageable);
    }

    // 소요거리로 정렬된 둘레길 목록을 페이지네이션과 함께 반환
    // 소요거리로 정렬된 둘레길 목록을 반환
    public Page<Trail> getTrailsSortedByLength(String direction, int page, int size) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by("lengthInKm").ascending() : Sort.by("lengthInKm").descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return trailRepository.findAll(pageable);
    }

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

    // 둘레길 생성 (관리자 기능)
    public Trail createTrail(Trail trail) {
        return trailRepository.save(trail);
    }

    // 둘레길 수정 (관리자 기능)
    public Trail updateTrail(Long id, Trail updatedTrail) {
        Trail existingTrail = getTrailById(id);
        existingTrail.setCourseName(updatedTrail.getCourseName());
        existingTrail.setStartPoint(updatedTrail.getStartPoint());
        existingTrail.setEndPoint(updatedTrail.getEndPoint());
        existingTrail.setCourseIntro(updatedTrail.getCourseIntro());
        existingTrail.setCourseOverview(updatedTrail.getCourseOverview());
        existingTrail.setTouristPoints(updatedTrail.getTouristPoints());
        existingTrail.setTravelInfo(updatedTrail.getTravelInfo());
        existingTrail.setGpxPath(updatedTrail.getGpxPath());
        existingTrail.setLength(updatedTrail.getLength());
        existingTrail.setTime(updatedTrail.getTime());
        existingTrail.setDifficulty(updatedTrail.getDifficulty());
        existingTrail.setLengthInKm(updatedTrail.getLengthInKm());
        existingTrail.setTimeInMinutes(updatedTrail.getTimeInMinutes());
        return trailRepository.save(existingTrail);
    }

    // 둘레길 삭제 (관리자 기능)
    public void deleteTrail(Long id) {
        trailRepository.deleteById(id);
    }
}
