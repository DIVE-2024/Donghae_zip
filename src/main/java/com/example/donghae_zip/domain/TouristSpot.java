package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@Table(name = "tourist_spot")
public class TouristSpot { //여행지 엔티티

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spot_id")
    private Long spotId;  // 여행지 고유 ID

    @Column(nullable = false, length = 255)
    private String title;  // 여행지 제목

    @Column(nullable = false, length = 255)
    private String address;  // 여행지 주소

    @Column(name = "place_category", nullable = false, length = 255)
    private String placeCategory;  // 장소 카테고리

    @Column(name = "one_line_desc", nullable = false, length = 500)
    private String oneLineDesc;  // 한 줄 설명

    @ElementCollection
    @CollectionTable(name = "tourist_spot_imageurls", joinColumns = @JoinColumn(name = "spot_id"))
    @Column(name = "image_url", nullable = true)
    private List<String> imageUrls;  // 이미지 URL 목록

    @Column(name = "detailed_info", nullable = false, columnDefinition = "TEXT")
    private String detailedInfo;  // 상세 정보

    // 유연한 Contact 정보: Map을 사용하여 key-value 형태로 정보 저장
    @ElementCollection
    @CollectionTable(name = "tourist_spot_contact_info", joinColumns = @JoinColumn(name = "spot_id"))
    @MapKeyColumn(name = "info_key")
    @Column(name = "info_value")
    private Map<String, String> contactInfo;  // 유연한 Contact 정보 (key-value 구조)

    @ElementCollection
    @CollectionTable(name = "tourist_spot_tags", joinColumns = @JoinColumn(name = "spot_id"))
    @Column(name = "tag", nullable = true)
    private List<String> tags;  // 태그 목록

    @Column(nullable = true, length = 255)
    private String longitude;  // 경도

    @Column(nullable = true, length = 255)
    private String latitude;   // 위도

    @Column(nullable = false, length = 255)
    private String region;  // 지역 정보

    @Column(name = "indoor_outdoor", nullable = true, length = 255)
    private String indoorOutdoor;  // 실내/실외 정보 (컬럼 매핑)

    private String category;
}
