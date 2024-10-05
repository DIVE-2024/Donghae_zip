package com.example.donghae_zip.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
public class CommentRequest {

    @NotNull(message = "리뷰 내용은 필수 항목입니다.")
    @JsonProperty("content")
    private String content;

    @NotNull(message = "평점은 필수 항목입니다.")
    @JsonProperty("rating")
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

