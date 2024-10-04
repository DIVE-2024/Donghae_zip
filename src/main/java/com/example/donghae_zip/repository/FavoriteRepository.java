package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 특정 사용자가 찜한 모든 장소를 페이지네이션으로 조회
    Page<Favorite> findByMember(Member member, Pageable pageable);

    // 특정 사용자가 찜한 여행지를 페이지네이션으로 조회
    Page<Favorite> findByMemberAndTouristSpotIsNotNull(Member member, Pageable pageable);

    // 특정 사용자가 찜한 숙박 시설을 페이지네이션으로 조회
    Page<Favorite> findByMemberAndAccommodationIsNotNull(Member member, Pageable pageable);

    // 특정 사용자가 찜한 음식점을 페이지네이션으로 조회
    Page<Favorite> findByMemberAndRestaurantIsNotNull(Member member, Pageable pageable);

    // 특정 사용자가 찜한 둘레길을 페이지네이션으로 조회
    Page<Favorite> findByMemberAndTrailIsNotNull(Member member, Pageable pageable);

    // 특정 사용자가 찜한 모든 찜 목록을 조회하는 메서드 추가
    List<Favorite> findByMember(Member member);  // 이 메서드를 추가

    // 관광지 찜 추가 및 삭제
    Optional<Favorite> findByMemberAndTouristSpot(Member member, TouristSpot touristSpot);
    void deleteByMemberAndTouristSpot(Member member, TouristSpot touristSpot);

    // 숙박시설 찜 추가 및 삭제
    Optional<Favorite> findByMemberAndAccommodation(Member member, Accommodation accommodation);
    void deleteByMemberAndAccommodation(Member member, Accommodation accommodation);

    // 음식점 찜 추가 및 삭제
    Optional<Favorite> findByMemberAndRestaurant(Member member, Restaurant restaurant);
    void deleteByMemberAndRestaurant(Member member, Restaurant restaurant);

    // 둘레길 찜 추가 및 삭제
    Optional<Favorite> findByMemberAndTrail(Member member, Trail trail);
    void deleteByMemberAndTrail(Member member, Trail trail);

    // 여러 명의 사용자가 찜한 목록 조회 (나이대 필터링 후 사용자들의 찜 목록)
    List<Favorite> findByMemberIn(List<Member> members);

    // 특정 사용자가 찜한 레스토랑 목록을 가져오는 메서드
    List<Favorite> findByMemberUserIdAndRestaurantIsNotNull(Long userId);

    List<Favorite> findByMemberAndRestaurantIsNotNull(Member member);


    // 찜이 많은 여행지 목록
    @Query("SELECT f.touristSpot FROM Favorite f WHERE f.touristSpot IS NOT NULL GROUP BY f.touristSpot ORDER BY COUNT(f.touristSpot) DESC")
    Page<TouristSpot> findPopularTouristSpots(Pageable pageable);

    // 찜이 많은 숙박시설 목록
    @Query("SELECT f.accommodation FROM Favorite f WHERE f.accommodation IS NOT NULL GROUP BY f.accommodation ORDER BY COUNT(f.accommodation) DESC")
    Page<Accommodation> findPopularAccommodations(Pageable pageable);

    // 찜이 많은 레스토랑 목록
    @Query("SELECT f.restaurant FROM Favorite f WHERE f.restaurant IS NOT NULL GROUP BY f.restaurant ORDER BY COUNT(f.restaurant) DESC")
    Page<Restaurant> findPopularRestaurants(Pageable pageable);

    // 찜이 많은 둘레길 목록
    @Query("SELECT f.trail FROM Favorite f WHERE f.trail IS NOT NULL GROUP BY f.trail ORDER BY COUNT(f.trail) DESC")
    Page<Trail> findPopularTrails(Pageable pageable);


}
