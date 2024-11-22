package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "travel")
public class Travel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "travel_id")
    private Long travelId; // 여행 고유 ID

    @Column(name = "user_id", nullable = false)
    private Long userId; // 사용자 ID (Member 테이블의 FK)

    @Column(name = "travel_name", nullable = false)
    private String travelName; // 여행 이름

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude // 순환 참조 방지
    @EqualsAndHashCode.Exclude // equals/hashCode 계산 시 제외
    private List<TravelDetail> travelDetails = new ArrayList<>(); // TravelDetail와의 연관 관계

    // 편의 메서드 (TravelDetail 추가)
    public void addTravelDetail(TravelDetail detail) {
        travelDetails.add(detail);
        detail.setTravel(this);
    }

    // 편의 메서드 (TravelDetail 제거)
    public void removeTravelDetail(TravelDetail detail) {
        travelDetails.remove(detail);
        detail.setTravel(null);
    }
}
