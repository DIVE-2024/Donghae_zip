package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.DonghaeTimetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonghaeTimetableRepository extends JpaRepository<DonghaeTimetable, Integer> {
    List<DonghaeTimetable> findByOperationDay(DonghaeTimetable.OperationDay operationDay);

    List<DonghaeTimetable> findByStationNameAndOperationDay(String stationName, DonghaeTimetable.OperationDay operationDay);
}
