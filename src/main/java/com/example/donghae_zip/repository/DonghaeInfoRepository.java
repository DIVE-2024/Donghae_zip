package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.DonghaeInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonghaeInfoRepository extends JpaRepository<DonghaeInfo, String> {
    // 필요한 커스텀 메서드가 있다면 여기에 추가
}
