package com.example.donghae_zip.domain;


import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "accommodation")
@Data // Lombok 어노테이션으로 getter/setter, toString, equals, hashCode 자동 생성
public class Accommodation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unique_id")
    private Long uniqueId;

    @Column(nullable = false)
    private String name;

    private String address;

    private String category;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "website_url", length = 2048)
    private String websiteUrl;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(columnDefinition = "json")
    private String facilities;

    @Column(name = "average_price")
    private Integer averagePrice;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('부산','울산')", nullable = false)
    private Region region;

    private String district;  // 구/군 필드 추가
}
