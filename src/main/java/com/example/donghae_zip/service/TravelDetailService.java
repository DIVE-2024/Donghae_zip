package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.TravelDetail;
import com.example.donghae_zip.repository.TravelDetailRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TravelDetailService {
    private final TravelDetailRepository travelDetailRepository;

    public TravelDetailService(TravelDetailRepository travelDetailRepository) {
        this.travelDetailRepository = travelDetailRepository;
    }

    public List<TravelDetail> getDetailsByTravelId(Long travelId) {
        return travelDetailRepository.findByTravel_TravelId(travelId);
    }

    // 상세 일정 추가
    public TravelDetail saveTravelDetail(TravelDetail travelDetail) {
        return travelDetailRepository.save(travelDetail);
    }

    // 특정 상세 일정 삭제
    public void deleteTravelDetail(Long detailId) {
        travelDetailRepository.deleteById(detailId);
    }

    // 특정 상세 일정 조회
    public TravelDetail getTravelDetailById(Long detailId) {
        return travelDetailRepository.findById(detailId)
                .orElseThrow(() -> new EntityNotFoundException("TravelDetail not found with ID: " + detailId));
    }

}
