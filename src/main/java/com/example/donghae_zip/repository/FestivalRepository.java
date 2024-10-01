package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Festival;
import com.example.donghae_zip.domain.FestivalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    boolean existsByTitleAndPeriod(String title, String period); // 중복체크

    List<Festival> findAll();

    Page<Festival> findByTitleContaining(String title, Pageable pageable);  // 제목으로 검색

    Page<Festival> findByPeriodContaining(String period, Pageable pageable);  // 기간별로 검색

    Page<Festival> findByRegionContaining(String region, Pageable pageable);  // 지역별로 검색

    Page<Festival> findByStatus(FestivalStatus status, Pageable pageable);  // 상태별로 조회

    // date 필드를 기준으로 년/월이 포함된 축제를 조회하는 메소드
    List<Festival> findFestivalsByDateContaining(String date);

}
