package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "donghae")
@Data // Lombok을 사용하여 Getter/Setter 자동 생성
public class DonghaeInfo {

    @Id
    @Column(name = "station_name", nullable = false)
    private String stationName; // 역 이름

    @Column(name = "line_name", nullable = false)
    private String lineName; // 노선 이름 (예: 동해선, 부산-울산선)

    @Column(name = "station_image_url", length = 2048)
    private String stationImageUrl; // 역 이미지를 보여주는 URL

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude; // 역의 경도 (위치 정보)

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude; // 역의 위도 (위치 정보)

    @Column(name = "transfer_available")
    private String transferAvailable; // 환승 가능 여부 (예: 가능, 불가능)

    @Column(name = "transfer_line")
    private String transferLine; // 환승 가능한 노선 이름

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('부산','울산','부산,울산')", nullable = false)
    private Region region; // 역이 속한 지역 (부산, 울산, 부산-울산)

    @Column(name = "railway_operator")
    private String railwayOperator; // 역을 운영하는 철도 사업자 (예: 코레일)

    @Column(name = "toilet_availability")
    private String toiletAvailability; // 화장실 이용 가능 여부 (예: 있음, 없음)

    @Column(name = "station_facilities", columnDefinition = "json")
    private String stationFacilities; // 역의 편의 시설 정보 (JSON 형식으로 저장)

    private String address; // 역의 주소

    @Column(name = "boarding_2022")
    private Integer boarding2022; // 2022년 승차 인원 수

    @Column(name = "alighting_2022")
    private Integer alighting2022; // 2022년 하차 인원 수

    @Column(name = "boarding_2023")
    private Integer boarding2023; // 2023년 승차 인원 수

    @Column(name = "alighting_2023")
    private Integer alighting2023; // 2023년 하차 인원 수
}
