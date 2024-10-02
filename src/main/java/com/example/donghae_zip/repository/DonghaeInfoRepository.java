package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.DonghaeInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonghaeInfoRepository extends JpaRepository<DonghaeInfo, String> {
    // 환승 가능한 동해선 역 정보 가져오기
    List<DonghaeInfo> findByTransferAvailable(String transferAvailable);

    // 2022년 승차 인원 기준 상위 5개 역 가져오기
    List<DonghaeInfo> findTop5ByOrderByBoarding2022Desc();

    // 2022년 하차 인원 기준 상위 5개 역 가져오기
    List<DonghaeInfo> findTop5ByOrderByAlighting2022Desc();

    // 2023년 승차 인원 기준 상위 5개 역 가져오기
    List<DonghaeInfo> findTop5ByOrderByBoarding2023Desc();

    // 2023년 하차 인원 기준 상위 5개 역 가져오기
    List<DonghaeInfo> findTop5ByOrderByAlighting2023Desc();
}
