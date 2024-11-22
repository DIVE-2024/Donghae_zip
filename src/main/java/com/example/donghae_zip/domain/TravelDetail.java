package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "travel_detail")
public class TravelDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId; // 상세 일정 고유 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "travel_id", nullable = false)
    @ToString.Exclude // 순환 참조 방지
    @EqualsAndHashCode.Exclude // equals/hashCode 계산 시 제외
    private Travel travel; // Travel 테이블의 FK

    @Column(name = "place_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PlaceType placeType; // 장소 유형 (ENUM: TOURIST_SPOT, ACCOMMODATION, RESTAURANT)

    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate; // 일정 날짜

    @Column(name = "place_id", nullable = false)
    private Long placeId; // 장소 ID (참조하는 장소 테이블의 PK)

    @Column(name = "start_time", nullable = false)
    private String startTime; // 일정 시작 시간 (HH:mm 형식)

    @Column(name = "end_time", nullable = false)
    private String endTime; // 일정 종료 시간 (HH:mm 형식)
}
