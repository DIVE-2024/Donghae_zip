package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.*;
import com.example.donghae_zip.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TravelDetailService {
    private final TravelDetailRepository travelDetailRepository;
    private final TravelRepository travelRepository;
    private final TouristSpotRepository touristSpotRepository;
    private final RestaurantRepository restaurantRepository;
    private final AccommodationRepository accommodationRepository;

    public TravelDetailService(TravelDetailRepository travelDetailRepository,
                               TravelRepository travelRepository,
                               TouristSpotRepository touristSpotRepository,
                               RestaurantRepository restaurantRepository,
                               AccommodationRepository accommodationRepository) {
        this.travelDetailRepository = travelDetailRepository;
        this.travelRepository = travelRepository;
        this.touristSpotRepository = touristSpotRepository;
        this.restaurantRepository = restaurantRepository;
        this.accommodationRepository = accommodationRepository;
    }


    public List<TravelDetail> getDetailsByTravelId(Long travelId) {
        return travelDetailRepository.findByTravel_TravelId(travelId);
    }

    // 상세 일정 추가
    // Save a new TravelDetail with a valid Travel object
    public TravelDetail saveTravelDetail(Long travelId, TravelDetail travelDetail) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new EntityNotFoundException("Travel not found with ID: " + travelId));

        // `placeType`이 제대로 설정되었는지 확인
        System.out.println("Saving TravelDetail with placeType: " + travelDetail.getPlaceType());

        travelDetail.setTravel(travel);
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

    // **추가된 메서드**: 장소 제목 가져오기
    public String getPlaceTitle(PlaceType placeType, Long placeId) {
        System.out.println("PlaceType: " + placeType + ", PlaceId: " + placeId);
        switch (placeType) {
            case TOURIST_SPOT:
                return touristSpotRepository.findById(placeId)
                        .map(TouristSpot::getTitle)
                        .orElse("Unknown Tourist Spot");
            case RESTAURANT:
                return restaurantRepository.findById(placeId)
                        .map(Restaurant::getName)
                        .orElse("Unknown Restaurant");
            case ACCOMMODATION:
                return accommodationRepository.findById(placeId)
                        .map(Accommodation::getName)
                        .orElse("Unknown Accommodation");
            default:
                return "Unknown Place";
        }
    }

    // 특정 날짜의 일정 조회 메서드
    public List<TravelDetail> getDetailsByTravelDate(Long travelId, String travelDate) {
        return travelDetailRepository.findByTravel_TravelIdAndTravelDate(travelId, LocalDate.parse(travelDate));
    }


}
