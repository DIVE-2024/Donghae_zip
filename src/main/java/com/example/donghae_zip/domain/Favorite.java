package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorite")
@Getter
@Setter
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long favoriteId;

    // 찜한 사용자와 매핑
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // Member 엔티티의 user_id와 매핑
    private Member member;

    // 찜한 여행지와 매핑
    @ManyToOne
    @JoinColumn(name = "spot_id", nullable = true)  // TouristSpot 엔티티의 spot_id와 매핑
    private TouristSpot touristSpot;

    // 찜한 숙박 시설과 매핑
    @ManyToOne
    @JoinColumn(name = "unique_id", nullable = true)  // Accommodation 엔티티의 unique_id와 매핑
    private Accommodation accommodation;

    // 찜한 음식점과 매핑
    @ManyToOne
    @JoinColumn(name = "id", nullable = true)  // Restaurant 엔티티의 id와 매핑
    private Restaurant restaurant;

    // 찜한 둘레길과 매핑
    @ManyToOne
    @JoinColumn(name = "trail_id", nullable = true)  // Trail 엔티티의 trail_id와 매핑
    private Trail trail;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;  // 찜한 날짜
}

