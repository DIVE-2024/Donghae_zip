package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Comment;
import com.example.donghae_zip.domain.CommentRequest;
import com.example.donghae_zip.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comment API", description = "리뷰와 평점 관련 API")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Operation(summary = "리뷰 생성", description = "새로운 리뷰를 생성하고 DB에 저장합니다.")
    @PostMapping
    public ResponseEntity<String> createComment(HttpServletRequest request, @RequestParam Long userId) {
        try {
            // 요청 데이터 전체를 수동으로 읽어 들임
            StringBuilder stringBuilder = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
            }

            // 원본 JSON 데이터를 출력 (디버깅용)
            String requestBody = stringBuilder.toString();
            System.out.println("Raw request body: " + requestBody);

            // ObjectMapper를 통해 JSON 데이터를 DTO로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            CommentRequest commentRequest = objectMapper.readValue(requestBody, CommentRequest.class);

            // 파싱된 데이터 로그 출력
            System.out.println("Parsed CommentRequest: ");
            System.out.println("Content: " + commentRequest.getContent());
            System.out.println("Rating: " + commentRequest.getRating());

            // CommentService를 통해 리뷰 생성 및 DB 저장
            Comment createdComment = commentService.createComment(commentRequest, userId);

            return ResponseEntity.status(HttpStatus.CREATED).body("Comment created successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }


    // 리뷰 수정 API
    @Operation(summary = "리뷰 수정", description = "작성자만이 특정 리뷰를 수정할 수 있습니다.")
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            @RequestParam Long userId) {  // 로그인된 사용자의 userId

        Comment updatedComment = commentService.updateComment(commentId, request, userId);
        return ResponseEntity.ok(updatedComment);
    }

    @Operation(summary = "리뷰 삭제", description = "작성자만이 특정 리뷰를 삭제할 수 있습니다.")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {  // 로그인된 사용자의 userId

        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "숙소 리뷰 조회", description = "특정 숙소에 대한 모든 리뷰를 조회합니다.")
    @GetMapping("/accommodations/{id}/reviews")
    public ResponseEntity<List<Comment>> getCommentsByAccommodation(@PathVariable Long id) {
        List<Comment> comments = commentService.getCommentsByAccommodation(id);
        return ResponseEntity.ok(comments);
    }

    @Operation(summary = "축제 리뷰 조회", description = "특정 축제에 대한 모든 리뷰를 조회합니다.")
    @GetMapping("/festivals/{id}/reviews")
    public ResponseEntity<List<Comment>> getCommentsByFestival(@PathVariable Long id) {
        List<Comment> comments = commentService.getCommentsByFestival(id);
        return ResponseEntity.ok(comments);
    }

    @Operation(summary = "식당 리뷰 조회", description = "특정 식당에 대한 모든 리뷰를 조회합니다.")
    @GetMapping("/restaurants/{id}/reviews")
    public ResponseEntity<List<Comment>> getCommentsByRestaurant(@PathVariable Long id) {
        List<Comment> comments = commentService.getCommentsByRestaurant(id);
        return ResponseEntity.ok(comments);
    }

    @Operation(summary = "관광지 리뷰 조회", description = "특정 관광지에 대한 모든 리뷰를 조회합니다.")
    @GetMapping("/tourist-spots/{id}/reviews")
    public ResponseEntity<List<Comment>> getCommentsByTouristSpot(@PathVariable Long id) {
        List<Comment> comments = commentService.getCommentsByTouristSpot(id);
        return ResponseEntity.ok(comments);
    }

    @Operation(summary = "둘레길 리뷰 조회", description = "특정 둘레길에 대한 모든 리뷰를 조회합니다.")
    @GetMapping("/trails/{id}/reviews")
    public ResponseEntity<List<Comment>> getCommentsByTrail(@PathVariable Long id) {
        List<Comment> comments = commentService.getCommentsByTrail(id);
        return ResponseEntity.ok(comments);
    }


    @Operation(summary = "숙소 평점 평균 조회", description = "숙소의 평점 평균을 조회합니다.")
    @GetMapping("/accommodations/{id}/average-rating")
    public ResponseEntity<Double> getAverageRatingForAccommodation(@PathVariable Long id) {
        Double averageRating = commentService.getAverageRatingForAccommodation(id);
        return ResponseEntity.ok(averageRating);
    }

    @Operation(summary = "축제 평점 평균 조회", description = "축제의 평점 평균을 조회합니다.")
    @GetMapping("/festivals/{id}/average-rating")
    public ResponseEntity<Double> getAverageRatingForFestival(@PathVariable Long id) {
        Double averageRating = commentService.getAverageRatingForFestival(id);
        return ResponseEntity.ok(averageRating);
    }

    @Operation(summary = "식당 평점 평균 조회", description = "식당의 평점 평균을 조회합니다.")
    @GetMapping("/restaurants/{id}/average-rating")
    public ResponseEntity<Double> getAverageRatingForRestaurant(@PathVariable Long id) {
        Double averageRating = commentService.getAverageRatingForRestaurant(id);
        return ResponseEntity.ok(averageRating);
    }

    @Operation(summary = "관광지 평점 평균 조회", description = "관광지의 평점 평균을 조회합니다.")
    @GetMapping("/tourist-spots/{id}/average-rating")
    public ResponseEntity<Double> getAverageRatingForTouristSpot(@PathVariable Long id) {
        Double averageRating = commentService.getAverageRatingForTouristSpot(id);
        return ResponseEntity.ok(averageRating);
    }

    @Operation(summary = "둘레길 평점 평균 조회", description = "둘레길의 평점 평균을 조회합니다.")
    @GetMapping("/trails/{id}/average-rating")
    public ResponseEntity<Double> getAverageRatingForTrail(@PathVariable Long id) {
        Double averageRating = commentService.getAverageRatingForTrail(id);
        return ResponseEntity.ok(averageRating);
    }

    @Operation(summary = "숙소 평점 높은 순으로 조회", description = "숙소를 평점 높은 순서대로 조회합니다.")
    @GetMapping("/accommodations/top-rated")
    public ResponseEntity<List<Object[]>> getTopRatedAccommodations() {
        return ResponseEntity.ok(commentService.getTopRatedAccommodations());
    }

    @Operation(summary = "축제 평점 높은 순으로 조회", description = "축제를 평점 높은 순서대로 조회합니다.")
    @GetMapping("/festivals/top-rated")
    public ResponseEntity<List<Object[]>> getTopRatedFestivals() {
        return ResponseEntity.ok(commentService.getTopRatedFestivals());
    }

    @Operation(summary = "식당 평점 높은 순으로 조회", description = "식당을 평점 높은 순서대로 조회합니다.")
    @GetMapping("/restaurants/top-rated")
    public ResponseEntity<List<Object[]>> getTopRatedRestaurants() {
        return ResponseEntity.ok(commentService.getTopRatedRestaurants());
    }

    @Operation(summary = "관광지 평점 높은 순으로 조회", description = "관광지를 평점 높은 순서대로 조회합니다.")
    @GetMapping("/tourist-spots/top-rated")
    public ResponseEntity<List<Object[]>> getTopRatedTouristSpots() {
        return ResponseEntity.ok(commentService.getTopRatedTouristSpots());
    }

    @Operation(summary = "둘레길 평점 높은 순으로 조회", description = "둘레길을 평점 높은 순서대로 조회합니다.")
    @GetMapping("/trails/top-rated")
    public ResponseEntity<List<Object[]>> getTopRatedTrails() {
        return ResponseEntity.ok(commentService.getTopRatedTrails());
    }

    @Operation(summary = "숙소 리뷰 개수 조회", description = "특정 숙소의 리뷰 개수를 조회합니다.")
    @GetMapping("/accommodations/{id}/review-count")
    public ResponseEntity<Long> countCommentsByAccommodation(@PathVariable Long id) {
        Long count = commentService.countCommentsByAccommodation(id);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "축제 리뷰 개수 조회", description = "특정 축제의 리뷰 개수를 조회합니다.")
    @GetMapping("/festivals/{id}/review-count")
    public ResponseEntity<Long> countCommentsByFestival(@PathVariable Long id) {
        Long count = commentService.countCommentsByFestival(id);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "식당 리뷰 개수 조회", description = "특정 식당의 리뷰 개수를 조회합니다.")
    @GetMapping("/restaurants/{id}/review-count")
    public ResponseEntity<Long> countCommentsByRestaurant(@PathVariable Long id) {
        Long count = commentService.countCommentsByRestaurant(id);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "관광지 리뷰 개수 조회", description = "특정 관광지의 리뷰 개수를 조회합니다.")
    @GetMapping("/tourist-spots/{id}/review-count")
    public ResponseEntity<Long> countCommentsByTouristSpot(@PathVariable Long id) {
        Long count = commentService.countCommentsByTouristSpot(id);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "둘레길 리뷰 개수 조회", description = "특정 둘레길의 리뷰 개수를 조회합니다.")
    @GetMapping("/trails/{id}/review-count")
    public ResponseEntity<Long> countCommentsByTrail(@PathVariable Long id) {
        Long count = commentService.countCommentsByTrail(id);
        return ResponseEntity.ok(count);
    }
}