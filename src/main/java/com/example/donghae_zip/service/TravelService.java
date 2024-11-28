package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Member;
import com.example.donghae_zip.domain.Travel;
import com.example.donghae_zip.repository.MemberRepository;
import com.example.donghae_zip.repository.TravelRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TravelService {
    private final TravelRepository travelRepository;
    private final MemberRepository memberRepository;

    public TravelService(TravelRepository travelRepository, MemberRepository memberRepository) {
        this.travelRepository = travelRepository;
        this.memberRepository = memberRepository;
    }

    // 특정 사용자의 여행 목록 조회 (Member 기반)
    public List<Travel> getUserTravels(Member member) {
        return travelRepository.findByMember(member);
    }

    // 여행 생성
    public Travel saveTravel(Travel travel) {
        return travelRepository.save(travel);
    }

    // 특정 여행 삭제
    public void deleteTravel(Long travelId) {
        travelRepository.deleteById(travelId);
    }

    // 특정 여행 조회
    public Travel getTravelById(Long travelId) {
        return travelRepository.findById(travelId)
                .orElseThrow(() -> new EntityNotFoundException("Travel not found with ID: " + travelId));
    }
}
