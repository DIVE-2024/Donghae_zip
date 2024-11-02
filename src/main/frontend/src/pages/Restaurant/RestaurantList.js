import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {Link, useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Trail/TrailListPage.css';
import ReviewCount from "../../components/Comment/ReviewCount";
import {getUserIdFromToken } from "../../components/Util/jwtUtils";

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
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]); // 사용자의 찜 목록
    const [userId,setUserId] = useState(null);
    const itemsPerPage = 15; // 한 페이지에 15개의 식당
    const maxPagesToShow = 5; // 1 ~ 5 페이지만 페이지네이션에 보여줌

    // 초기 로드 시 JWT에서 userId 설정
    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);
    }, []);

    // 사용자 찜 목록 가져오기
    const fetchFavoriteRestaurants = useCallback(() => {
        const token = sessionStorage.getItem('token');
        const userId = getUserIdFromToken();
        console.log(userId);

        if (!userId) {
            console.error('userId가 세션에 저장되지 않았습니다.');
            return;
        }

        axios.get(`/api/favorites/auth/restaurants/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page: page,  // 페이지 번호 추가
                size: itemsPerPage  // 페이지 크기 추가
            }
        })
            .then(response => {
                // 데이터 구조가 예상대로인지를 확인하기 위한 로그
                console.log("Fetched favorites data:", response.data);

                const favoriteRestaurantIds = response.data.content.map(fav => fav.restaurant.id); // restaurantId 배열로 변환
                setFavoriteRestaurants(favoriteRestaurantIds); // 찜 목록 상태에 저장
                setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
                setRestaurantCount(response.data.totalElements); // 전체 식당 수 설정
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching favorite restaurants:', error);
                setLoading(false);
            });
    }, [page]);

    useEffect(() => {
        if (region) {
            axios.get(`/api/restaurants/region/${region}/hashtags`)
                .then(response => setHashtags(Object.keys(response.data)))
                .catch(error => console.error('Error fetching hashtags:', error));

            axios.get(`/api/restaurants/region/${region}/districts`)
                .then(response => setDistricts(response.data))
                .catch(error => console.error('Error fetching districts:', error));
        }
    }, [region]);

    // Fetch restaurant data based on filters
    const fetchRestaurants = useCallback(() => {
        setLoading(true);
        let url = `/api/restaurants?page=${page}&size=${itemsPerPage}`;

        if (region && !district && !hashtag) {
            url = `/api/restaurants/region/${region}?page=${page}&size=${itemsPerPage}`;
        } else if (region && district && !hashtag) {
            url = `/api/restaurants/searchByRegionAndDistrict?region=${region}&district=${district}&page=${page}&size=${itemsPerPage}`;
        } else if (region && district && hashtag) {
            url = `/api/restaurants/searchByDistrict?region=${region}&district=${district}&hashtag=${encodeURIComponent(hashtag)}&page=${page}&size=${itemsPerPage}`;
        }

        axios.get(url)
            .then(response => {
                setRestaurants(response.data.content);
                setRestaurantCount(response.data.totalElements);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restaurant data:', error);
                setLoading(false);
            });
    }, [region, district, hashtag, page]);

    // userId가 설정된 후 관광지 및 찜 목록을 불러옴
    useEffect(() => {
        if (userId) {
            fetchRestaurants();
            fetchFavoriteRestaurants();
        }
    }, [fetchRestaurants, fetchFavoriteRestaurants, userId]);

    // 페이지네이션을 위한 페이지 번호 계산
    const getPaginationGroup = () => {
        const startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);
        return [...Array(endPage - startPage + 1).keys()].map(num => startPage + num);
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    const handleFavoriteToggle = (id) => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isFavorite = favoriteRestaurants.includes(id);

        if (isFavorite) {
            // 좋아요 삭제 요청
            axios.delete(`/api/favorites/auth/restaurants/${id}?email=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    // 기존 코드에서 삭제할 id를 명확히 지정하여 상태를 업데이트합니다
                    setFavoriteRestaurants((prevFavorites) => prevFavorites.filter(favId => favId !== id));
                })
                .catch(error => {
                    console.error("좋아요 삭제 중 오류:", error);
                    alert("좋아요 삭제에 실패했습니다.");
                });
        } else {
            // 좋아요 추가 요청
            axios.post(`/api/favorites/auth/restaurants/${id}?email=${userId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    setFavoriteRestaurants((prevFavorites) => [...prevFavorites, id]);
                })
                .catch(error => {
                    console.error("좋아요 추가 중 오류:", error);
                    alert("좋아요 추가에 실패했습니다.");
                });
        }
    };

    return (
        <div className="container custom-container mt-5">
            <div className="page-title">먹거리 결과 총 {restaurantCount}개</div>

            {/* Region Filter */}
            <div className="input-group filter-group mb-4">
                <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>

                {/* District Filter */}
                {region && (
                    <select className="form-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                        <option value="">구/군 선택</option>
                        {districts.map((dist, index) => (
                            <option key={index} value={dist}>
                                {dist}
                            </option>
                        ))}
                    </select>
                )}

                {/* Hashtag Filter */}
                {region && (
                    <select className="form-select" value={hashtag} onChange={(e) => setHashtag(e.target.value)}>
                        <option value="">모든 해시태그</option>
                        {hashtags.map((tag, index) => (
                            <option key={index} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                )}

                {/* Reset Button */}
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