package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "review")
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;  // 리뷰 작성자

    @ManyToOne
    @JoinColumn(name = "spot_id", nullable = true)
    private TouristSpot touristSpot;  // 리뷰 대상 여행지

    @ManyToOne
    @JoinColumn(name = "accommodation_id", nullable = true)
    private Accommodation accommodation;  // 리뷰 대상 숙박 시설

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = true)
    private Restaurant restaurant;  // 리뷰 대상 음식점

    @ManyToOne
    @JoinColumn(name = "trail_id", nullable = true)
    private Trail trail;  // 리뷰 대상 둘레길

    @Column(nullable = false)
    private Integer rating;  // 평점 (1~5)

    @Column(nullable = false, length = 500)
    private String comment;  // 리뷰 내용

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;  // 리뷰 작성 날짜
}
