package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Travel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelRepository extends JpaRepository<Travel, Long> {
    // 사용자 ID로 여행 목록 조회
    List<Travel> findByUserId(Long userId);
}
