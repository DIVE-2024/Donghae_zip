package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Travel;
import com.example.donghae_zip.domain.TravelDetail;
import com.example.donghae_zip.repository.TravelDetailRepository;
import com.example.donghae_zip.repository.TravelRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TravelDetailService {
    private final TravelDetailRepository travelDetailRepository;
    private final TravelRepository travelRepository;

    public TravelDetailService(TravelDetailRepository travelDetailRepository, TravelRepository travelRepository) {
        this.travelDetailRepository = travelDetailRepository;
        this.travelRepository = travelRepository;
    }

    public List<TravelDetail> getDetailsByTravelId(Long travelId) {
        return travelDetailRepository.findByTravel_TravelId(travelId);
    }

    // 상세 일정 추가
    // Save a new TravelDetail with a valid Travel object
    public TravelDetail saveTravelDetail(Long travelId, TravelDetail travelDetail) {
        // Fetch the Travel object using travelId
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new EntityNotFoundException("Travel not found with ID: " + travelId));

        // Set the Travel object in TravelDetail
        travelDetail.setTravel(travel);

        // Save the TravelDetail to the repository
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
