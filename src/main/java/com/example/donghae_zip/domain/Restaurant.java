package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "restaurant")
@Data // Lombok을 사용하여 Getter/Setter, toString 등의 메서드를 자동 생성
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hashtag;
    private String name;
    private String address;
    private String phone;

    @Column(columnDefinition = "json")
    private String tags;

    @Column(columnDefinition = "json")
    private String info;

    @Column(name = "business_hours", columnDefinition = "json")
    private String businessHours;

    @Column(name = "menu_info", columnDefinition = "json")
    private String menuInfo;

    @Column(name = "image_url", columnDefinition = "json")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('부산','울산')")
    private Region region;

    private Double latitude;  // 위도 필드 추가
    private Double longitude; // 경도 필드 추가
}
