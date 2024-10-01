package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Festival;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    boolean existsByTitleAndPeriod(String title, String period);
}
