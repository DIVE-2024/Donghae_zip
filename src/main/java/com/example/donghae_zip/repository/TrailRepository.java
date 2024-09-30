package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Trail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrailRepository extends JpaRepository<Trail, Long> {

    //코스명이 같은 데이터를 확인하는 메서드
    boolean existsByCourseName(String courseName);
}
