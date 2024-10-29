package com.example.donghae_zip.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CommentRequest {

    @NotNull(message = "리뷰 내용은 필수 항목입니다.")
    @JsonProperty("content") // JSON 필드와 매핑
    private String content;

    @NotNull(message = "평점은 필수 항목입니다.")
    @JsonProperty("rating") // JSON 필드와 매핑
    private Integer rating;

    @JsonProperty("imageUrls")
    private List<String> imageUrls;

    @JsonProperty("accommodationId")
    private Long accommodationId;

    @JsonProperty("festivalId")
    private Long festivalId;

    @JsonProperty("restaurantId")
    private Long restaurantId;

    @JsonProperty("touristSpotId")
    private Long touristSpotId;

    @JsonProperty("trailId")
    private Long trailId;
}
