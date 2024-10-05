package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.*;
import com.example.donghae_zip.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;


import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TouristSpotRepository touristSpotRepository;

    @Autowired
    private AccommodationRepository accommodationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private TrailRepository trailRepository;

    // 찜 추가 (관광지)
    public Favorite addFavoriteSpot(Long userId, Long spotId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        TouristSpot spot = touristSpotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("여행지를 찾을 수 없습니다."));

        // 이미 찜했는지 확인
        favoriteRepository.findByMemberAndTouristSpot(member, spot)
                .ifPresent(favorite -> {
                    throw new IllegalStateException("이미 찜한 여행지입니다.");
                });

        // 찜 추가
        Favorite favorite = new Favorite();
        favorite.setMember(member);
        favorite.setTouristSpot(spot);
        favorite.setCreatedAt(LocalDateTime.now());

        return favoriteRepository.save(favorite);
    }

    // 찜 삭제 (관광지)
    public void removeFavoriteSpot(Long userId, Long spotId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        TouristSpot spot = touristSpotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("여행지를 찾을 수 없습니다."));

        // 찜 기록 삭제
        favoriteRepository.deleteByMemberAndTouristSpot(member, spot);
    }

    // 찜 추가 (숙박시설)
    public Favorite addFavoriteAccommodation(Long userId, Long accommodationId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new IllegalArgumentException("숙박시설을 찾을 수 없습니다."));

        // 이미 찜했는지 확인
        favoriteRepository.findByMemberAndAccommodation(member, accommodation)
                .ifPresent(favorite -> {
                    throw new IllegalStateException("이미 찜한 숙박시설입니다.");
                });

        // 찜 추가
        Favorite favorite = new Favorite();
        favorite.setMember(member);
        favorite.setAccommodation(accommodation);
        favorite.setCreatedAt(LocalDateTime.now());

        return favoriteRepository.save(favorite);
    }

    // 찜 삭제 (숙박시설)
    public void removeFavoriteAccommodation(Long userId, Long accommodationId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new IllegalArgumentException("숙박시설을 찾을 수 없습니다."));

        // 찜 기록 삭제
        favoriteRepository.deleteByMemberAndAccommodation(member, accommodation);
    }


    // 찜 추가 (음식점)
    public Favorite addFavoriteRestaurant(Long userId, Long restaurantId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("음식점을 찾을 수 없습니다."));

        // 이미 찜했는지 확인
        favoriteRepository.findByMemberAndRestaurant(member, restaurant)
                .ifPresent(favorite -> {
                    throw new IllegalStateException("이미 찜한 음식점입니다.");
                });

        // 찜 추가
        Favorite favorite = new Favorite();
        favorite.setMember(member);
        favorite.setRestaurant(restaurant);
        favorite.setCreatedAt(LocalDateTime.now());

        return favoriteRepository.save(favorite);
    }

    // 찜 삭제 (음식점)
    public void removeFavoriteRestaurant(Long userId, Long restaurantId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("음식점을 찾을 수 없습니다."));

        // 찜 기록 삭제
        favoriteRepository.deleteByMemberAndRestaurant(member, restaurant);
    }

    // 찜 추가 (둘레길)
    public Favorite addFavoriteTrail(Long userId, Long trailId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new IllegalArgumentException("둘레길을 찾을 수 없습니다."));

        // 이미 찜했는지 확인
        favoriteRepository.findByMemberAndTrail(member, trail)
                .ifPresent(favorite -> {
                    throw new IllegalStateException("이미 찜한 둘레길입니다.");
                });

        // 찜 추가
        Favorite favorite = new Favorite();
        favorite.setMember(member);
        favorite.setTrail(trail);
        favorite.setCreatedAt(LocalDateTime.now());

        return favoriteRepository.save(favorite);
    }

    // 찜 삭제 (둘레길)
    public void removeFavoriteTrail(Long userId, Long trailId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new IllegalArgumentException("둘레길을 찾을 수 없습니다."));

        // 찜 기록 삭제
        favoriteRepository.deleteByMemberAndTrail(member, trail);
    }



    // 특정 사용자가 찜한 모든 장소를 페이지네이션으로 조회
    public Page<Favorite> getFavoriteSpots(Long userId, int page, int size) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        return favoriteRepository.findByMember(member, pageable);
    }

    // 특정 사용자가 찜한 여행지를 페이지네이션으로 조회
    public Page<Favorite> getFavoriteTouristSpots(Long userId, int page, int size) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        return favoriteRepository.findByMemberAndTouristSpotIsNotNull(member, pageable);
    }

    // 특정 사용자가 찜한 숙박 시설을 페이지네이션으로 조회
    public Page<Favorite> getFavoriteAccommodations(Long userId, int page, int size) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        return favoriteRepository.findByMemberAndAccommodationIsNotNull(member, pageable);
    }

    // 특정 사용자가 찜한 음식점을 페이지네이션으로 조회
    public Page<Favorite> getFavoriteRestaurants(Long userId, int page, int size) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        return favoriteRepository.findByMemberAndRestaurantIsNotNull(member, pageable);
    }

    // 특정 사용자가 찜한 둘레길을 페이지네이션으로 조회
    public Page<Favorite> getFavoriteTrails(Long userId, int page, int size) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        return favoriteRepository.findByMemberAndTrailIsNotNull(member, pageable);
    }

    // 사용자 기반 카테고리 필터링을 통한 여행지 추천 (페이징 처리)
    public Page<TouristSpot> recommendSpotsByCategory(Long userId, Pageable pageable) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 현재 사용자가 이미 찜한 장소 목록
        Set<TouristSpot> userFavoriteSpots = favoriteRepository.findByMember(member).stream()
                .map(Favorite::getTouristSpot)
                .filter(Objects::nonNull)  // Null 체크 추가
                .collect(Collectors.toSet());

        // 사용자가 찜한 장소들의 카테고리 추출
        Set<String> favoriteCategories = userFavoriteSpots.stream()
                .map(TouristSpot::getPlaceCategory)
                .filter(Objects::nonNull)  // Null 체크 추가
                .collect(Collectors.toSet());

        // 아직 찜하지 않은, 유사한 카테고리의 장소 찾기
        List<TouristSpot> similarCategorySpots = touristSpotRepository.findByPlaceCategoryIn(
                        new ArrayList<>(favoriteCategories),
                        Pageable.unpaged()  // 페이징이 필요 없으면 unpaged(), 필요하면 Pageable 객체 전달
                ).stream()
                .filter(spot -> !userFavoriteSpots.contains(spot))  // 이미 찜한 여행지 제외
                .distinct()
                .collect(Collectors.toList());

        int start = Math.min((int) pageable.getOffset(), similarCategorySpots.size());
        int end = Math.min(start + pageable.getPageSize(), similarCategorySpots.size());

        return new PageImpl<>(similarCategorySpots.subList(start, end), pageable, similarCategorySpots.size());
    }


    // 사용자 기반 협업 필터링을 통한 추천 (페이징 처리)
    public Page<TouristSpot> recommendSpots(Long userId, Pageable pageable) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 현재 사용자가 이미 찜한 장소 목록
        Set<TouristSpot> userFavoriteSpots = favoriteRepository.findByMember(member).stream()
                .map(Favorite::getTouristSpot)
                .collect(Collectors.toSet());

        // 유사한 사용자 목록 찾기
        List<Member> similarUsers = findSimilarUsers(member);

        // 유사한 사용자의 찜 목록 중에서 현재 사용자가 찜하지 않은 여행지 추천
        List<TouristSpot> recommendedSpots = similarUsers.stream()
                .flatMap(similarUser -> favoriteRepository.findByMember(similarUser).stream())
                .map(Favorite::getTouristSpot)
                .filter(spot -> !userFavoriteSpots.contains(spot))  // 현재 사용자가 이미 찜한 장소는 제외
                .distinct()  // 중복 제거
                .collect(Collectors.toList());

        // List를 Page로 변환
        int start = Math.min((int) pageable.getOffset(), recommendedSpots.size());
        int end = Math.min(start + pageable.getPageSize(), recommendedSpots.size());

        return new PageImpl<>(recommendedSpots.subList(start, end), pageable, recommendedSpots.size());
    }

    // 다른 사용자와 유사도 기반 사용자 찾기 (유사도 계산 로직)
    private List<Member> findSimilarUsers(Member user) {
        List<Member> allUsers = memberRepository.findAll();

        // 두 명의 사용자 간 유사도를 계산해 유사한 사용자 목록을 반환
        return allUsers.stream()
                .filter(otherUser -> !otherUser.equals(user))  // 자신을 제외
                .sorted((a, b) -> Double.compare(calculateUserSimilarity(user, a), calculateUserSimilarity(user, b)))  // user와 다른 사용자의 유사도 비교
                .limit(5)  // 상위 5명의 유사한 사용자 선택
                .collect(Collectors.toList());
    }

    // 사용자 유사도 계산 (Jaccard 유사도 사용)
    private double calculateUserSimilarity(Member userA, Member userB) {
        // userA의 찜한 여행지 목록
        Set<TouristSpot> spotsA = favoriteRepository.findByMember(userA).stream()
                .map(Favorite::getTouristSpot)
                .collect(Collectors.toSet());

        // userB의 찜한 여행지 목록
        Set<TouristSpot> spotsB = favoriteRepository.findByMember(userB).stream()
                .map(Favorite::getTouristSpot)
                .collect(Collectors.toSet());

        // 공통 찜 장소
        Set<TouristSpot> commonSpots = new HashSet<>(spotsA);
        commonSpots.retainAll(spotsB);

        // 유사도 계산: 공통 찜 장소 / 전체 찜 장소 수 (분모가 0이 되는 상황을 방지)
        int unionSize = spotsA.size() + spotsB.size() - commonSpots.size();
        return unionSize == 0 ? 0 : (double) commonSpots.size() / unionSize;
    }

    public List<TouristSpot> getPopularSpotsByAgeGroup(int minAge, int maxAge) {
        // 해당 나이대에 속하는 사용자들 필터링
        List<Member> membersInAgeGroup = memberRepository.findByAgeBetween(minAge, maxAge);

        // 해당 사용자들의 찜 목록을 수집
        List<TouristSpot> popularSpots = favoriteRepository.findByMemberIn(membersInAgeGroup).stream()
                .map(Favorite::getTouristSpot)  // 찜한 여행지로 매핑
                .filter(Objects::nonNull)       // Null 값 필터링
                .collect(Collectors.toList());

        // 여행지를 찜한 횟수로 그룹핑 (Map<TouristSpot, Long> 형태로 반환)
        Map<TouristSpot, Long> spotCountMap = popularSpots.stream()
                .collect(Collectors.groupingBy(spot -> spot, Collectors.counting()));

        // 찜 횟수로 정렬하고, 상위 10개 여행지 추출
        return spotCountMap.entrySet().stream()
                .sorted(Map.Entry.<TouristSpot, Long>comparingByValue().reversed())  // 찜한 횟수로 내림차순 정렬
                .limit(10)  // 상위 10개 여행지만 추출
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    // 나이대별로 찜이 많은 여행지
    public Map<String, Page<TouristSpot>> getPopularSpotsByAllAgeGroups(Pageable pageable) {
        Map<String, Page<TouristSpot>> popularSpotsByAgeGroup = new HashMap<>();

        // 각 나이대별로 찜이 많은 여행지를 조회 (예시로 10대부터 80대까지)
        int[] ageGroups = {10, 20, 30, 40, 50, 60, 70, 80};

        for (int ageGroup : ageGroups) {
            List<Member> membersInAgeGroup = memberRepository.findByAgeBetween(ageGroup, ageGroup + 9);

            if (!membersInAgeGroup.isEmpty()) {
                // 찜 목록이 많은 순으로 정렬하여 각 나이대별로 인기 여행지 조회
                List<TouristSpot> popularSpots = favoriteRepository.findByMemberIn(membersInAgeGroup).stream()
                        .collect(Collectors.groupingBy(Favorite::getTouristSpot, Collectors.counting())) // 관광지별 찜한 횟수 계산
                        .entrySet().stream()
                        .sorted(Map.Entry.<TouristSpot, Long>comparingByValue().reversed()) // 찜한 횟수가 많은 순으로 정렬
                        .map(Map.Entry::getKey)
                        .collect(Collectors.toList());

                // List를 Page로 변환하여 페이징 처리
                int start = Math.min((int) pageable.getOffset(), popularSpots.size());
                int end = Math.min(start + pageable.getPageSize(), popularSpots.size());
                Page<TouristSpot> page = new PageImpl<>(popularSpots.subList(start, end), pageable, popularSpots.size());

                popularSpotsByAgeGroup.put(ageGroup + "대", page);
            } else {
                Page<TouristSpot> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
                popularSpotsByAgeGroup.put(ageGroup + "대", emptyPage);
            }
        }

        return popularSpotsByAgeGroup;
    }

    // 해시태그를 기준으로 선호하는 레스토랑 추천 메서드
    public Page<Restaurant> recommendRestaurantsByHashtag(Long userId, Pageable pageable) {
        // Member 객체로 사용자 조회
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // Member 객체로 찜한 레스토랑 목록 가져오기
        List<Favorite> favorites = favoriteRepository.findByMemberAndRestaurantIsNotNull(member);

        // 사용자가 찜한 레스토랑에서 해시태그 분석
        Map<String, Long> hashtagFrequency = favorites.stream()
                .map(Favorite::getRestaurant)
                .filter(Objects::nonNull)
                .map(Restaurant::getHashtag)
                .filter(Objects::nonNull)  // null인 해시태그 필터링
                .collect(Collectors.groupingBy(hashtag -> hashtag, Collectors.counting()));

        // 빈도가 높은 해시태그 순으로 정렬된 해시태그 목록
        List<String> sortedHashtags = hashtagFrequency.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // 가장 선호하는 해시태그로 레스토랑 추천
        if (!sortedHashtags.isEmpty()) {
            String topHashtag = sortedHashtags.get(0);
            return restaurantRepository.findByHashtagContaining(topHashtag, pageable);
        }

        // 기본적으로 해시태그가 없으면 빈 페이지 반환
        return Page.empty();
    }


    // 찜이 많은 여행지 조회
    public Page<TouristSpot> getPopularTouristSpots(Pageable pageable) {
        return favoriteRepository.findPopularTouristSpots(pageable);
    }

    // 찜이 많은 숙소 조회
    public Page<Accommodation> getPopularAccommodations(Pageable pageable) {
        return favoriteRepository.findPopularAccommodations(pageable);
    }

    // 찜이 많은 레스토랑 조회
    public Page<Restaurant> getPopularRestaurants(Pageable pageable) {
        return favoriteRepository.findPopularRestaurants(pageable);
    }

    // 찜이 많은 둘레길 조회
    public Page<Trail> getPopularTrails(Pageable pageable) {
        return favoriteRepository.findPopularTrails(pageable);
    }
}