package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.TravelDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TravelDetailRepository extends JpaRepository<TravelDetail, Long> {
    // 특정 여행 ID로 상세 일정 조회
    List<TravelDetail> findByTravel_TravelId(Long travelId);

    // 특정 날짜의 일정 조회 쿼리 메서드
    List<TravelDetail> findByTravel_TravelIdAndTravelDate(Long travelId, LocalDate travelDate);

}
