package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@IdClass(DonghaeTimetableId.class) // 복합 키 클래스 지정
@Table(name = "donghae_timetable")
@Data // Lombok을 사용하여 Getter/Setter 자동 생성
public class DonghaeTimetable {

    @Id
    @Column(name = "train_id", nullable = false)
    private Integer trainId; // 기차 ID

    @Id
    @Column(name = "station_name", nullable = false)
    private String stationName; // 역 이름

    @Column(name = "arrival_time")
    private String arrivalTime; // 도착 시간

    @Column(name = "special_note")
    private String specialNote; // 특이 사항

    @Enumerated(EnumType.STRING)
    @Column(name = "operation_day", columnDefinition = "enum('평일','휴일')", nullable = false)
    private OperationDay operationDay; // 운행 요일 (평일, 휴일)

    public enum OperationDay {
        평일,
        휴일
    }
}
