import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Trail/TrailListPage.css';
import ReviewCount from "../../components/Comment/ReviewCount";
import { getUserIdFromToken } from "../../components/Util/jwtUtils";
import AverageRating from "../../components/Comment/AverageRating";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [restaurantCount, setRestaurantCount] = useState(0);
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
    const [userId, setUserId] = useState(null);
    const itemsPerPage = 15;
    const maxPagesToShow = 5;

    // 사용자 ID 설정
    useEffect(() => {
        const id = getUserIdFromToken();
        if (id) setUserId(id);
    }, []);

    // useEffect로 region 값이 변경될 때 districts와 hashtags를 업데이트
    useEffect(() => {
        if (region) {
            axiosInstance.get(`/api/restaurants/region/${region}/hashtags`)
                .then(response => setHashtags(Object.keys(response.data)))
                .catch(error => console.error('Error fetching hashtags:', error));

            axiosInstance.get(`/api/restaurants/region/${region}/districts`)
                .then(response => setDistricts(response.data))
                .catch(error => console.error('Error fetching districts:', error));
        } else {
            // 기본값 설정 (빈 값으로 초기화)
            setDistricts([]);
            setHashtags([]);
        }
    }, [region]);

    // 찜한 식당 목록 가져오기
    const fetchFavoriteRestaurants = useCallback(async () => {
        const token = sessionStorage.getItem('token');
        if (!userId || !token) return;

        try {
            const response = await axiosInstance.get(`/api/favorites/auth/restaurants/${userId}`, {
                params: { page, size: itemsPerPage },
            });
            const favoriteIds = response.data.content.map(fav => fav.restaurant.id);
            setFavoriteRestaurants(favoriteIds);
        } catch (error) {
            console.error('Error fetching favorite restaurants:', error);
        }
    }, [userId, page]);

    // 필터에 따른 식당 목록 가져오기
    const fetchRestaurants = useCallback(async () => {
        let url = `/api/restaurants?page=${page}&size=${itemsPerPage}`;
        if (region && !district && !hashtag) {
            url = `/api/restaurants/region/${region}?page=${page}&size=${itemsPerPage}`;
        } else if (region && district && !hashtag) {
            url = `/api/restaurants/searchByRegionAndDistrict?region=${region}&district=${district}&page=${page}&size=${itemsPerPage}`;
        } else if (region && district && hashtag) {
            url = `/api/restaurants/searchByDistrict?region=${region}&district=${district}&hashtag=${encodeURIComponent(hashtag)}&page=${page}&size=${itemsPerPage}`;
        }

        try {
            const response = await axiosInstance.get(url);
            setRestaurants(response.data.content);
            setRestaurantCount(response.data.totalElements);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
        }
    }, [region, district, hashtag, page, itemsPerPage]);

    // 모든 데이터가 로드될 때까지 로딩 상태 유지
    useEffect(() => {
        const fetchData = async () => {
            // 초기 로딩일 때만 로딩 상태를 true로 설정
            if (restaurants.length === 0) setLoading(true);
            try {
                await fetchRestaurants();  // 항상 식당 목록 불러오기
                if (userId) {
                    await fetchFavoriteRestaurants();  // 로그인된 경우에만 찜한 식당 목록 불러오기
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false); // 데이터 로드 후 로딩 종료
            }
        };

        fetchData();  // userId와 관계없이 fetchData 호출
    }, [fetchRestaurants, fetchFavoriteRestaurants, userId]);



    // 페이지네이션 계산
    const getPaginationGroup = () => {
        const startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);
        return [...Array(endPage - startPage + 1).keys()].map(num => startPage + num);
    };

    // 찜 토글 기능
    const handleFavoriteToggle = async (id) => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isFavorite = favoriteRestaurants.includes(id);

        try {
            if (isFavorite) {
                await axiosInstance.delete(`/api/favorites/auth/restaurants/${id}?email=${userId}`);
                setFavoriteRestaurants(prev => prev.filter(favId => favId !== id));
            } else {
                await axiosInstance.post(`/api/favorites/auth/restaurants/${id}?email=${userId}`, null);
                setFavoriteRestaurants(prev => [...prev, id]);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            alert("좋아요 토글에 실패했습니다.");
        }
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="container custom-container mt-5">
            <div className="page-title">맛집 결과 총 {restaurantCount}개</div>

            {/* Region Filter */}
            <div className="input-group filter-group mb-4" style={{width:'100rem',maxWidth:'1000px',height:'3rem'}}>
                <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)} style={{fontSize:'1.3rem'}}>
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>
                {region && (
                    <select className="form-select" value={district} onChange={(e) => setDistrict(e.target.value)} style={{fontSize:'1.3rem'}}>
                        <option value="">구/군 선택</option>
                        {districts.map((dist, index) => (
                            <option key={index} value={dist}>{dist}</option>
                        ))}
                    </select>
                )}
                {region && (
                    <select className="form-select" value={hashtag} onChange={(e) => setHashtag(e.target.value)} style={{fontSize:'1.3rem'}}>
                        <option value="">모든 해시태그</option>
                        {hashtags.map((tag, index) => (
                            <option key={index} value={tag}>{tag}</option>
                        ))}
                    </select>
                )}
                <button className="btn btn-secondary" onClick={() => {
                    setRegion('');
                    setDistrict('');
                    setHashtag('');
                    fetchRestaurants();
                }}>초기화</button>
            </div>

            {/* Restaurant List */}
            <div className="row">
                {restaurants.map(restaurant => (
                    <div className="col-md-4 mb-4" key={restaurant.id}>
                        <Link to={`/restaurant/${restaurant.id}`} className="card-link">
                            <div className="card h-100 trail-card">
                                <img
                                    src={restaurant.imageUrl && JSON.parse(restaurant.imageUrl).length > 0
                                        ? JSON.parse(restaurant.imageUrl)[0]
                                        : '/image/default_image.png'}
                                    className="card-img-top img-fixed"
                                    alt={restaurant.name}
                                />
                                <div className="card-body d-flex flex-column">
                                    <div style={{fontSize:'1.9rem'}} className="card-title course-title">{restaurant.name}</div>
                                    <p style={{fontSize:'1.3rem'}} className="card-text course-overview">{restaurant.address}</p>
                                    <p style={{fontSize:'1.1rem'}} className="trail-info">전화번호: {restaurant.phone}</p>
                                    <div className="mt-auto d-flex align-items-center"
                                         style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <i
                                            className={`bi bi-heart${favoriteRestaurants.includes(restaurant.id) ? '-fill heart-icon-fill' : ''} heart-icon`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleFavoriteToggle(restaurant.id);
                                            }}
                                        ></i>
                                        <ReviewCount className="btn btn-primary review-btn me-2"
                                                     entityType="restaurants" id={restaurant.id}/>
                                    </div>
                                    {/* 평균 평점 표시 */}
                                    <AverageRating entityType="restaurants" entityId={restaurant.id} />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>이전</button>
                        </li>
                        {getPaginationGroup().map((pageNum) => (
                            <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(pageNum)}>
                                    {pageNum + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>다음</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default RestaurantList;
