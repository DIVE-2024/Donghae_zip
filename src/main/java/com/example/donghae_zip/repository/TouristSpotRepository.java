package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.TouristSpot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TouristSpotRepository extends JpaRepository<TouristSpot, Long> {
    boolean existsByTitleAndAddress(String title, String address);
}
