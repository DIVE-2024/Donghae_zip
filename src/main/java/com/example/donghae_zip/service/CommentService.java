package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.*;
import com.example.donghae_zip.exception.ResourceNotFoundException;
import com.example.donghae_zip.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private  MemberRepository memberRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AccommodationRepository accommodationRepository;

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private TouristSpotRepository touristSpotRepository;

    @Autowired
    private TrailRepository trailRepository;


    // 숙소별 평점 평균 계산 (unique_id 사용)
    public Double getAverageRatingForAccommodation(Long accommodationId) {
        return commentRepository.findAverageRatingByAccommodation(accommodationId);
    }

    // 축제별 평점 평균 계산 (festival_id 사용)
    public Double getAverageRatingForFestival(Long festivalId) {
        return commentRepository.findAverageRatingByFestival(festivalId);
    }

    // 식당별 평점 평균 계산 (id 사용)
    public Double getAverageRatingForRestaurant(Long restaurantId) {
        return commentRepository.findAverageRatingByRestaurant(restaurantId);
    }

    // 관광지별 평점 평균 계산 (spot_id 사용)
    public Double getAverageRatingForTouristSpot(Long touristSpotId) {
        return commentRepository.findAverageRatingByTouristSpot(touristSpotId);
    }

    // 둘레길별 평점 평균 계산 (trail_id 사용)
    public Double getAverageRatingForTrail(Long trailId) {
        return commentRepository.findAverageRatingByTrail(trailId);
    }

    // 숙소별 평점 평균 높은 순서로 정렬된 결과 가져오기
    public List<Object[]> getTopRatedAccommodations() {
        return commentRepository.findTopRatedAccommodations();
    }

    // 축제별 평점 평균 높은 순서로 정렬된 결과 가져오기
    public List<Object[]> getTopRatedFestivals() {
        return commentRepository.findTopRatedFestivals();
    }

    // 식당별 평점 평균 높은 순서로 정렬된 결과 가져오기
    public List<Object[]> getTopRatedRestaurants() {
        return commentRepository.findTopRatedRestaurants();
    }

    // 관광지별 평점 평균 높은 순서로 정렬된 결과 가져오기
    public List<Object[]> getTopRatedTouristSpots() {
        return commentRepository.findTopRatedTouristSpots();
    }

    // 둘레길별 평점 평균 높은 순서로 정렬된 결과 가져오기
    public List<Object[]> getTopRatedTrails() {
        return commentRepository.findTopRatedTrails();
    }

    // 숙소 조회 메서드
    private Accommodation findAccommodationById(Long accommodationId) {
        return accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new EntityNotFoundException("Accommodation not found with id " + accommodationId));
    }

    // 축제 조회 메서드
    private Festival findFestivalById(Long festivalId) {
        return festivalRepository.findById(festivalId)
                .orElseThrow(() -> new EntityNotFoundException("Festival not found with id " + festivalId));
    }

    // 식당 조회 메서드
    private Restaurant findRestaurantById(Long restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new EntityNotFoundException("Restaurant not found with id " + restaurantId));
    }

    // 관광지 조회 메서드
    private TouristSpot findTouristSpotById(Long touristSpotId) {
        return touristSpotRepository.findById(touristSpotId)
                .orElseThrow(() -> new EntityNotFoundException("TouristSpot not found with id " + touristSpotId));
    }

    // 둘레길 조회 메서드
    private Trail findTrailById(Long trailId) {
        return trailRepository.findById(trailId)
                .orElseThrow(() -> new EntityNotFoundException("Trail not found with id " + trailId));
    }

    public Comment createComment(CommentRequest request, Long userId) {
        // 작성자(Member) 정보 조회 (userId로 Member를 찾음)
        Member member = findMemberById(userId);  // 여기서 Member가 유효한지 확인

        // 새로운 리뷰 생성
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setRating(request.getRating());
        comment.setMember(member);  // Member 엔티티 설정
        comment.setCreatedAt(LocalDateTime.now());
        comment.setImageUrls(request.getImageUrls()); // 이미지 URL 저장

        // 연결된 엔티티에 따라 설정
        if (request.getAccommodationId() != null) {
            Accommodation accommodation = accommodationRepository.findById(request.getAccommodationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));
            comment.setAccommodation(accommodation);
        }

        if (request.getFestivalId() != null) {
            Festival festival = festivalRepository.findById(request.getFestivalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Festival not found"));
            comment.setFestival(festival);
        }

        if (request.getRestaurantId() != null) {
            Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
            comment.setRestaurant(restaurant);
        }

        if (request.getTouristSpotId() != null) {
            TouristSpot touristSpot = touristSpotRepository.findById(request.getTouristSpotId())
                    .orElseThrow(() -> new ResourceNotFoundException("TouristSpot not found"));
            comment.setTouristSpot(touristSpot);
        }

        if (request.getTrailId() != null) {
            Trail trail = trailRepository.findById(request.getTrailId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trail not found"));
            comment.setTrail(trail);
        }

        // DB에 Comment 저장
        return commentRepository.save(comment);
    }


    public Member findMemberById(Long userId) {
        return memberRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + userId));
    }




    // 리뷰 수정 메서드
    public Comment updateComment(Long commentId, CommentRequest request, Long userId) {
        // 리뷰 ID로 기존 리뷰 조회
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id " + commentId));

        // 작성자와 요청한 사용자가 동일한지 확인
        if (!existingComment.getMember().getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to edit this comment.");
        }

        // 리뷰 내용 수정
        existingComment.setContent(request.getContent());
        existingComment.setRating(request.getRating());
        existingComment.setImageUrls(request.getImageUrls());
        existingComment.setUpdatedAt(LocalDateTime.now());

        // 수정된 리뷰 저장
        return commentRepository.save(existingComment);
    }

    // 리뷰 삭제 메서드
    public void deleteComment(Long commentId, Long userId) {
        // 리뷰가 존재하는지 확인
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id " + commentId));

        // 작성자와 요청한 사용자가 동일한지 확인
        if (!existingComment.getMember().getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to delete this comment.");
        }

        // 리뷰 삭제
        commentRepository.deleteById(commentId);
    }

    // 숙소에 대한 모든 리뷰 조회
    public List<Comment> getCommentsByAccommodation(Long accommodationId) {
        return commentRepository.findAllByAccommodationUniqueId(accommodationId);
    }

    // 축제에 대한 모든 리뷰 조회
    public List<Comment> getCommentsByFestival(Long festivalId) {
        return commentRepository.findAllByFestivalFestivalId(festivalId);
    }

    // 식당에 대한 모든 리뷰 조회
    public List<Comment> getCommentsByRestaurant(Long restaurantId) {
        return commentRepository.findAllByRestaurantId(restaurantId);
    }

    // 관광지에 대한 모든 리뷰 조회
    public List<Comment> getCommentsByTouristSpot(Long touristSpotId) {
        return commentRepository.findAllByTouristSpotSpotId(touristSpotId);
    }

    // 둘레길에 대한 모든 리뷰 조회
    public List<Comment> getCommentsByTrail(Long trailId) {
        return commentRepository.findAllByTrailTrailId(trailId);
    }


    // 숙소별 리뷰 개수 계산
    public Long countCommentsByAccommodation(Long accommodationId) {
        return commentRepository.countCommentsByAccommodation(accommodationId);
    }

    // 축제별 리뷰 개수 계산
    public Long countCommentsByFestival(Long festivalId) {
        return commentRepository.countCommentsByFestival(festivalId);
    }

    // 식당별 리뷰 개수 계산
    public Long countCommentsByRestaurant(Long restaurantId) {
        return commentRepository.countCommentsByRestaurant(restaurantId);
    }

    // 관광지별 리뷰 개수 계산
    public Long countCommentsByTouristSpot(Long touristSpotId) {
        return commentRepository.countCommentsByTouristSpot(touristSpotId);
    }

    // 둘레길별 리뷰 개수 계산
    public Long countCommentsByTrail(Long trailId) {
        return commentRepository.countCommentsByTrail(trailId);
    }
}
