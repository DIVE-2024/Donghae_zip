package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Festival;
import com.example.donghae_zip.domain.FestivalStatus;
import com.example.donghae_zip.repository.FestivalRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

import static org.springframework.security.web.savedrequest.FastHttpDateFormat.parseDate;

@Service
public class FestivalService {

    @Autowired
    private FestivalRepository festivalRepository;

    // ID로 축제 조회
    public Festival getFestivalById(Long id) {
        return festivalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No festival found with ID: " + id));
    }

    // 제목으로 축제 검색 (페이지네이션 적용)
    public Page<Festival> searchFestivalsByTitle(String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return festivalRepository.findByTitleContaining(title, pageable);
    }

    // 년/월을 기준으로 축제 조회
    public List<Festival> searchFestivalsByYearAndMonth(int year, int month) {
        // 요청된 년/월을 형식에 맞춰 생성 (예: "2024년 12월")
        String monthString = String.format("%04d년 %d월", year, month);
        // 해당 년/월이 포함된 축제를 조회
        return festivalRepository.findFestivalsByDateContaining(monthString);
    }



    // 지역별로 축제 조회 (페이지네이션 적용)
    public Page<Festival> searchFestivalsByRegion(String region, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return festivalRepository.findByRegionContaining(region, pageable);
    }

    // 상태별로 축제 조회 (페이지네이션 적용)
    public Page<Festival> getFestivalsByStatus(FestivalStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return festivalRepository.findByStatus(status, pageable);
    }

    // 축제 상태를 업데이트하는 메소드
    public void updateFestivalStatus() {
        List<Festival> allFestivals = festivalRepository.findAll();

        for (Festival festival : allFestivals) {
            String period = festival.getPeriod();  // 예: "2025.03.31 ~ 2025.04.02" 또는 "2024년 12월 예정"
            String[] dates = period.split(" ~ ");

            if (dates.length == 2) {
                // 시작 날짜와 종료 날짜가 모두 있는 경우 처리
                try {
                    LocalDate startDate = parseDate(dates[0].split("\\(")[0].trim(), null);  // 첫 번째 날짜
                    LocalDate endDate = parseDate(dates[1].split("\\(")[0].trim(), startDate.getYear() + "");  // 두 번째 날짜에 연도 보완

                    // 축제 상태 결정 로직
                    FestivalStatus newStatus = determineFestivalStatus(startDate, endDate);

                    if (festival.getStatus() != newStatus) {
                        festival.setStatus(newStatus);
                        festivalRepository.save(festival);  // 상태가 변경되면 DB에 업데이트
                    }
                } catch (Exception e) {
                    // 예외 발생 시 로그 기록
                    System.out.println("Error parsing dates for festival: " + festival.getTitle() + ", period: " + period);
                }
            } else {
                // 날짜 형식이 한 개 또는 잘못된 경우 처리
                try {
                    LocalDate startDate = parseDate(dates[0].split("\\(")[0].trim(), null);
                    LocalDate endDate = startDate.plusDays(1);  // 기본적으로 하루짜리 축제로 가정

                    FestivalStatus newStatus = determineFestivalStatus(startDate, endDate);
                    if (festival.getStatus() != newStatus) {
                        festival.setStatus(newStatus);
                        festivalRepository.save(festival);
                    }
                } catch (Exception e) {
                    System.out.println("Invalid period format for festival: " + festival.getTitle() + ", period: " + period);
                }
            }
        }
    }

    // 날짜 파싱 메소드 (주어진 dateStr이 다양한 형식에 대응할 수 있도록 개선)
    public LocalDate parseDate(String dateStr, String fallbackYear) {
        try {
            // 날짜에서 불필요한 문자열 제거 (예: "년", "월", "일", "예정", "말", "초")
            dateStr = dateStr.replace("년", "").replace("월", "").replace("일", "")
                    .replace("예정", "").replace("말", "").replace("초", "").trim();

            // 공백을 마침표로 변경 (ex: '2024 12' -> '2024.12')
            dateStr = dateStr.replace(" ", ".").replaceAll("\\.(\\d)(\\.|$)", ".0$1$2").replaceAll("\\.$", "");

            // 연도가 없는 경우 시작 날짜의 연도(fallbackYear)를 추가
            if (!dateStr.matches("\\d{4}.*") && fallbackYear != null) {
                dateStr = fallbackYear + "." + dateStr;  // 시작 연도가 없으면 첫 번째 날짜의 연도를 추가
            }

            // '-' 구분자를 포함한 날짜 형식 처리
            if (dateStr.contains("-")) {
                return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } else {
                if (dateStr.contains(".")) {
                    // 'yyyy.MM'처럼 날짜가 '년'과 '월'만 있을 경우 '01'을 추가
                    if (dateStr.length() == 7) {
                        dateStr += ".01";
                    }
                    return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy.MM.dd"));
                } else {
                    return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyyMMdd"));
                }
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + dateStr);
        }
    }

    // 축제 상태를 결정하는 메소드
    private FestivalStatus determineFestivalStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();
        if (today.isBefore(startDate)) {
            return FestivalStatus.PENDING;  // 예정됨
        } else if (!today.isAfter(endDate)) {
            return FestivalStatus.ONGOING;  // 진행 중
        } else {
            return FestivalStatus.COMPLETED;  // 완료됨
        }
    }

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

    // 새로운 축제 추가 (관리자 기능)
    public Festival createFestival(Festival festival) {
        return festivalRepository.save(festival);
    }

    // 축제 수정 (관리자 기능)
    public Festival updateFestival(Long id, Festival updatedFestival) {
        Festival existingFestival = getFestivalById(id);
        existingFestival.setTitle(updatedFestival.getTitle());
        existingFestival.setAddress(updatedFestival.getAddress());
        existingFestival.setContact(updatedFestival.getContact());
        existingFestival.setPeriod(updatedFestival.getPeriod());
        existingFestival.setLocation(updatedFestival.getLocation());
        existingFestival.setHomepage(updatedFestival.getHomepage());
        existingFestival.setDate(updatedFestival.getDate());
        existingFestival.setRegion(updatedFestival.getRegion());
        existingFestival.setStatus(updatedFestival.getStatus());
        return festivalRepository.save(existingFestival);
    }

    // 축제 삭제 (관리자 기능)
    public void deleteFestival(Long id) {
        festivalRepository.deleteById(id);
    }
}