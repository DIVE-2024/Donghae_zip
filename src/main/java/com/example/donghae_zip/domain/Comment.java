package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;  // 리뷰 내용

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;  // 작성일자

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;  // 수정일자

    // 리뷰를 작성한 사용자 정보
    @Column(name = "username", nullable = false)
    private String username;

    // 평점 필드 추가
    @Column(name = "rating", nullable = false)
    private Integer rating;  // 평점 (1 ~ 5)

    // 각 Accommodation, Festival, Restaurant, TouristSpot, Trail 과의 관계
    @ManyToOne
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

    @ManyToOne
    @JoinColumn(name = "festival_id")
    private Festival festival;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "tourist_spot_id")
    private TouristSpot touristSpot;

    @ManyToOne
    @JoinColumn(name = "trail_id")
    private Trail trail;
}
