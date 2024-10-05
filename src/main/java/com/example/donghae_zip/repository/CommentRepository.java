package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 Accommodation에 대한 평점 평균 계산 (unique_id 사용)
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.accommodation.uniqueId = :accommodationId")
    Double findAverageRatingByAccommodation(@Param("accommodationId") Long accommodationId);

    // 특정 Festival에 대한 평점 평균 계산 (festival_id 사용)
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.festival.festivalId = :festivalId")
    Double findAverageRatingByFestival(@Param("festivalId") Long festivalId);

    // 특정 Restaurant에 대한 평점 평균 계산 (id 사용)
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.restaurant.id = :restaurantId")
    Double findAverageRatingByRestaurant(@Param("restaurantId") Long restaurantId);

    // 특정 TouristSpot에 대한 평점 평균 계산 (spot_id 사용)
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.touristSpot.spotId = :touristSpotId")
    Double findAverageRatingByTouristSpot(@Param("touristSpotId") Long touristSpotId);

    // 특정 Trail에 대한 평점 평균 계산 (trail_id 사용)
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.trail.trailId = :trailId")
    Double findAverageRatingByTrail(@Param("trailId") Long trailId);

    // 숙소별 평점 평균을 계산하고 높은 순으로 정렬
    @Query("SELECT c.accommodation, AVG(c.rating) AS avgRating " +
            "FROM Comment c WHERE c.accommodation IS NOT NULL " +
            "GROUP BY c.accommodation " +
            "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedAccommodations();

    // 축제별 평점 평균을 계산하고 높은 순으로 정렬
    @Query("SELECT c.festival, AVG(c.rating) AS avgRating " +
            "FROM Comment c WHERE c.festival IS NOT NULL " +
            "GROUP BY c.festival " +
            "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedFestivals();

    // 식당별 평점 평균을 계산하고 높은 순으로 정렬
    @Query("SELECT c.restaurant, AVG(c.rating) AS avgRating " +
            "FROM Comment c WHERE c.restaurant IS NOT NULL " +
            "GROUP BY c.restaurant " +
            "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedRestaurants();

    // 관광지별 평점 평균을 계산하고 높은 순으로 정렬
    @Query("SELECT c.touristSpot, AVG(c.rating) AS avgRating " +
            "FROM Comment c WHERE c.touristSpot IS NOT NULL " +
            "GROUP BY c.touristSpot " +
            "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedTouristSpots();

    // 둘레길별 평점 평균을 계산하고 높은 순으로 정렬
    @Query("SELECT c.trail, AVG(c.rating) AS avgRating " +
            "FROM Comment c WHERE c.trail IS NOT NULL " +
            "GROUP BY c.trail " +
            "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedTrails();

    // 특정 숙소의 리뷰 개수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.accommodation.uniqueId = :accommodationId")
    Long countCommentsByAccommodation(@Param("accommodationId") Long accommodationId);

    // 특정 축제의 리뷰 개수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.festival.festivalId = :festivalId")
    Long countCommentsByFestival(@Param("festivalId") Long festivalId);

    // 특정 식당의 리뷰 개수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.restaurant.id = :restaurantId")
    Long countCommentsByRestaurant(@Param("restaurantId") Long restaurantId);

    // 특정 관광지의 리뷰 개수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.touristSpot.spotId = :touristSpotId")
    Long countCommentsByTouristSpot(@Param("touristSpotId") Long touristSpotId);

    // 특정 둘레길의 리뷰 개수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.trail.trailId = :trailId")
    Long countCommentsByTrail(@Param("trailId") Long trailId);

    // 숙소별 리뷰 조회 (unique_id 사용)
    List<Comment> findAllByAccommodationUniqueId(Long accommodationId);

    // 축제별 리뷰 조회 (festival_id 사용)
    List<Comment> findAllByFestivalFestivalId(Long festivalId);

    // 식당별 리뷰 조회 (id 사용)
    List<Comment> findAllByRestaurantId(Long restaurantId);

    // 관광지별 리뷰 조회 (spot_id 사용)
    List<Comment> findAllByTouristSpotSpotId(Long touristSpotId);

    // 둘레길별 리뷰 조회 (trail_id 사용)
    List<Comment> findAllByTrailTrailId(Long trailId);
}
