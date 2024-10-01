package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Accommodation;
import com.example.donghae_zip.domain.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    List<Accommodation> findByRegion(Region region);

    List<Accommodation> findByRegionAndAveragePriceBetween(Region region, int minPrice, int maxPrice);
}
