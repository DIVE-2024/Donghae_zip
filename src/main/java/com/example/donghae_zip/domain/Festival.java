package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

// @Entity: JPA에서 이 클래스가 데이터베이스의 테이블과 매핑된다는 것을 나타냄
@Entity
@Getter
@Setter
// @Table(name = "festival"): 이 엔티티가 데이터베이스의 'festival' 테이블과 매핑됨을 명시
@Table(name = "festival")
public class Festival {

    // @Id: 이 필드가 테이블의 기본 키(PK)라는 것을 나타냄
    // @GeneratedValue(strategy = GenerationType.IDENTITY): 기본 키를 자동으로 생성 (AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "festival_id")  // 데이터베이스 컬럼 이름을 'festival_id'로 명시
    private Long festivalId;

    // 축제 제목 필드: null 허용 안 함, 최대 길이 255자
    @Column(nullable = false, length = 255)
    private String title;

    // 축제 이미지 URL 목록: 다수의 이미지 URL을 저장 (null 허용)
    @ElementCollection
    @Column(nullable = true)
    private List<String> images;

    // 축제 주소 필드: null 허용, 최대 길이 255자
    @Column(nullable = true, length = 255)
    private String address;

    // 축제 문의처 필드: null 허용, 최대 길이 255자
    @Column(nullable = true, length = 255)
    private String contact;

    // 축제 기간 필드: null 허용 안 함, 최대 길이 255자
    @Column(nullable = false, length = 255)
    private String period;

    // 축제 장소 필드: null 허용, 최대 길이 255자
    @Column(nullable = true, length = 255)
    private String location;

    // 축제 홈페이지 URL 필드: null 허용, 최대 길이 255자
    @Column(nullable = true, length = 255)
    private String homepage;

    // 축제 날짜 필드: null 허용 안 함, 최대 길이 255자
    @Column(nullable = false, length = 255)
    private String date;

    // 지역 필드: null 허용 안 함, 최대 길이 255자
    @Column(nullable = false, length = 255)
    private String region;

    @Enumerated(EnumType.STRING)
    private FestivalStatus status;  // 축제 상태
}