package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "festival")
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "festival_id")
    private Long festivalId;

    @Column(nullable = false, length = 255)
    private String title;

    // @ElementCollection을 사용하여 다중 이미지 URL을 별도의 테이블에 저장
    @ElementCollection
    @CollectionTable(name = "festival_imageurls", joinColumns = @JoinColumn(name = "festival_id"))
    @Column(name = "image_url")
    private List<String> images;

    @Column(nullable = true, length = 255)
    private String address;

    @Column(nullable = true, length = 255)
    private String contact;

    @Column(nullable = false, length = 255)
    private String period;

    @Column(nullable = true, length = 255)
    private String location;

    @Column(nullable = true, length = 255)
    private String homepage;

    @Column(nullable = false, length = 255)
    private String date;

    @Column(nullable = false, length = 255)
    private String region;

    @Enumerated(EnumType.STRING)
    private FestivalStatus status;  // 축제 상태
}
