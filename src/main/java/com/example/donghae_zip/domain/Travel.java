package com.example.donghae_zip.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "travel")
public class Travel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "travel_id")
    private Long travelId; // 여행 고유 ID

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Member 테이블의 userId와 매핑
    private Member member; // Member와 연관 관계 설정

    @Column(name = "title", nullable = false)
    @NotBlank(message = "여행 제목은 필수 입력 항목입니다.")
    private String title;

    @Column(name = "start_date")
    private LocalDate startDate; // 여행 시작일

    @Column(name = "end_date")
    private LocalDate endDate; // 여행 종료일

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // 레코드 생성 시간

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 레코드 수정 시간



    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonManagedReference // Travel → TravelDetail 직렬화 포함
    private List<TravelDetail> travelDetails = new ArrayList<>();

    // 편의 메서드 (TravelDetail 추가)
    public void addTravelDetail(TravelDetail detail) {
        travelDetails.add(detail);
        detail.setTravel(this);
    }

    // 편의 메서드 (TravelDetail 제거)
    public void removeTravelDetail(TravelDetail detail) {
        travelDetails.remove(detail);
        detail.setTravel(null);
    }
}
