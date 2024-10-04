package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Trail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrailRepository extends JpaRepository<Trail, Long> {

    //코스명이 같은 데이터를 확인하는 메서드
    boolean existsByCourseName(String courseName);

    // 소요시간으로 정렬 + 페이지네이션
    Page<Trail> findAllByOrderByTimeInMinutes(Pageable pageable);

    // 소요거리로 정렬 + 페이지네이션
    Page<Trail> findAllByOrderByLengthInKm(Pageable pageable);

    Page<Trail> findByCourseNameContaining(String title, Pageable pageable);
    Page<Trail> findByDifficultyContaining(String difficulty, Pageable pageable);

    // ID로 특정 둘레길 조회
    Optional<Trail> findById(Long trailId);


}
