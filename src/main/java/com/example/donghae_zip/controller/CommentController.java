package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.*;
import com.example.donghae_zip.exception.ResourceNotFoundException;
import com.example.donghae_zip.repository.*;
import com.example.donghae_zip.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.example.donghae_zip.util.JwtTokenUtil;

import java.io.BufferedReader;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comment API", description = "리뷰와 평점 관련 API")
public class CommentController {

    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CommentRepository commentRepository;


    @Autowired
    private CommentService commentService;

    @Autowired
    private TrailRepository trailRepository;  // 소문자로 시작해야 함

    @Autowired
    private TouristSpotRepository touristSpotRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AccommodationRepository accommodationRepository;

    @Autowired
    private FestivalRepository festivalRepository;


    // 생성자 주입
    @Autowired
    public CommentController(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/auth/my-reviews")
    public ResponseEntity<List<Comment>> getMyReviews(@RequestParam Long userId) {
        List<Comment> reviews = commentService.getCommentsByMember(userId);
        return ResponseEntity.ok(reviews);
    }


    @PostMapping
    public ResponseEntity<Comment> createComment(HttpServletRequest request) {
        try {
            // HttpServletRequest로부터 JSON 문자열을 직접 읽어옴
            String jsonRequestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            // JSON을 CommentRequest로 변환
            CommentRequest commentRequest = objectMapper.readValue(jsonRequestBody, CommentRequest.class);

            // 받은 데이터를 출력하여 확인
            System.out.println("Received commentRequest: " + commentRequest.toString());
            System.out.println("content: " + commentRequest.getContent());
            System.out.println("rating: " + commentRequest.getRating());
            System.out.println("trailId: " + commentRequest.getTrailId());
            System.out.println("touristSpotId: "+ commentRequest.getTouristSpotId());

            // JWT 토큰에서 사용자 정보 추출
            String token = request.getHeader("Authorization").substring(7);
            String email = jwtTokenUtil.extractEmail(token);
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + email));

            // Comment 엔티티로 변환
            Comment comment = new Comment();
            comment.setContent(commentRequest.getContent());
            comment.setRating(commentRequest.getRating());
            comment.setMember(member);  // 작성자 정보 설정
            comment.setCreatedAt(LocalDateTime.now());
            comment.setImageUrls(commentRequest.getImageUrls());

            // 연관 관계 매핑
            if (commentRequest.getTrailId() != null) {
                Trail trail = trailRepository.findById(commentRequest.getTrailId())
                        .orElseThrow(() -> new ResourceNotFoundException("Trail not found"));
                comment.setTrail(trail);
            }
            if(commentRequest.getTouristSpotId() != null) {
                TouristSpot touristSpot = touristSpotRepository.findById(commentRequest.getTouristSpotId())
                        .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));
                comment.setTouristSpot(touristSpot);
            }
            if(commentRequest.getRestaurantId() != null) {
                Restaurant restaurant = restaurantRepository.findById(commentRequest.getRestaurantId())
                        .orElseThrow(() -> new ResourceNotFoundException("restaurant not found"));
                comment.setRestaurant(restaurant);
            }
            if(commentRequest.getAccommodationId() != null) {
                Accommodation accommodation = accommodationRepository.findById((commentRequest.getAccommodationId()))
                        .orElseThrow(() -> new ResourceNotFoundException("accommdation not found"));
                comment.setAccommodation(accommodation);
            }
            if(commentRequest.getFestivalId() != null ) {
                Festival festival = festivalRepository.findById((commentRequest.getFestivalId()))
                        .orElseThrow(() -> new ResourceNotFoundException("Festival not found"));
                comment.setFestival(festival);
            }
            // DB에 Comment 저장
            Comment savedComment = commentRepository.save(comment);

            // 저장된 댓글 정보를 포함하여 응답 반환
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }



    // 리뷰 수정 API
    @Operation(summary = "리뷰 수정", description = "작성자만이 특정 리뷰를 수정할 수 있습니다.")
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long commentId,
            HttpServletRequest request,  // JSON을 직접 처리하기 위해 HttpServletRequest 사용
            @RequestParam String email) {

        try {
            // HttpServletRequest로부터 JSON 문자열을 직접 읽어옴
            String jsonRequestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            // JSON을 CommentRequest로 변환
            CommentRequest commentRequest = objectMapper.readValue(jsonRequestBody, CommentRequest.class);

            // 받은 데이터를 출력하여 확인
            System.out.println("Received commentRequest: " + commentRequest.toString());
            System.out.println("content: " + commentRequest.getContent());
            System.out.println("rating: " + commentRequest.getRating());
            System.out.println("touristSpotId: " + commentRequest.getTouristSpotId());

            // JWT 토큰에서 사용자 정보 추출
            String token = request.getHeader("Authorization").substring(7);
            String tokenEmail = jwtTokenUtil.extractEmail(token);

            // 이메일 확인
            System.out.println("Token Email: " + tokenEmail);
            System.out.println("Request Email: " + email);

            if (!tokenEmail.equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // 댓글 수정 처리
            Comment updatedComment = commentService.updateComment(commentId, commentRequest, email);
            return ResponseEntity.ok(updatedComment);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }




    @Operation(summary = "리뷰 삭제", description = "작성자만이 특정 리뷰를 삭제할 수 있습니다.")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam String email) {  // 이메일로 로그인된 사용자 확인

        commentService.deleteComment(commentId, email);  // 이메일을 넘김
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
        System.out.println("여행지 id: " + id);
        System.out.println("여행지 관광 리뷰 개수: " + count);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "둘레길 리뷰 개수 조회", description = "특정 둘레길의 리뷰 개수를 조회합니다.")
    @GetMapping("/trails/{id}/review-count")
    public ResponseEntity<Long> countCommentsByTrail(@PathVariable Long id) {
        Long count = commentService.countCommentsByTrail(id);
        return ResponseEntity.ok(count);
    }
}