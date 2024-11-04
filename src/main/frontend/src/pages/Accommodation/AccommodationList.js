import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Trail/TrailListPage.css';
import ReviewCount from "../../components/Comment/ReviewCount";
import {getUserIdFromToken } from "../../components/Util/jwtUtils";
import AverageRating from "../../components/Comment/AverageRating";

const AccommodationList = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAccommodations, setTotalAccommodations] = useState(0); // 총 숙박 수 상태 추가
    const [currentPage, setCurrentPage] = useState(0);
    const [region, setRegion] = useState('');
    const [favoriteAccommodations, setFavoriteAccommodations] = useState([]); // 사용자의 찜 목록
    const [accommodationsCount, setAccommodationCount] = useState(0);
    const [priceRange, setPriceRange] = useState('');
    const [ userId , setUserId] = useState(null);
    const [page, setPage] = useState(0);

    const itemsPerPage = 15;
    const maxPageNumbersToShow = 5; // 1 ~ 5 페이지만 페이지네이션에 보여줌


    // 초기 로드 시 JWT에서 userId 설정
    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);
    }, []);


    // 사용자 찜 목록 가져오기
    const fetchFavoriteAccommodaions = useCallback(() => {
        const token = sessionStorage.getItem('token');
        const userId = getUserIdFromToken();
        console.log(userId);

        if (!userId) {
            console.error('userId가 세션에 저장되지 않았습니다.');
            return;
        }

        axios.get(`/api/favorites/auth/accommodations/${userId}`, {
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

                const favoriteAccommodationsIds = response.data.content.map(fav => fav.accommodation.uniqueId);
                setFavoriteAccommodations(favoriteAccommodationsIds); // 찜 목록 상태에 저장
                setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
                setAccommodationCount(response.data.totalElements); // 전체 식당 수 설정
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching favorite restaurants:', error);
                setLoading(false);
            });
    }, [page]);

    const fetchAccommodations = useCallback(() => {
        let apiUrl = `/api/accommodations?page=${currentPage}&size=${itemsPerPage}`;

        if (region) {
            apiUrl = `/api/accommodations/region/${region}?page=${currentPage}&size=${itemsPerPage}`;
        }

        if (region && priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-');
            apiUrl = `/api/accommodations/region/${region}/price-range?page=${currentPage}&size=${itemsPerPage}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
        }

        axios.get(apiUrl)
            .then(response => {
                setAccommodations(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalAccommodations(response.data.totalElements); // 총 숙박 수 설정
            })
            .catch(error => {
                console.error('Error fetching accommodation data:', error);
            });
    }, [region, priceRange, currentPage]);

    useEffect(() => {
        fetchAccommodations();
        fetchFavoriteAccommodaions();
    }, [fetchAccommodations,fetchFavoriteAccommodaions,userId]);

    const handleFavoriteToggle = (id) => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isFavorite = favoriteAccommodations.includes(id);

        if (isFavorite) {
            // 좋아요 삭제 요청
            axios.delete(`/api/favorites/auth/accommodations/${id}?email=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    // 기존 코드에서 삭제할 id를 명확히 지정하여 상태를 업데이트합니다
                    setFavoriteAccommodations((prevFavorites) => prevFavorites.filter(favId => favId !== id));
                })
                .catch(error => {
                    console.error("좋아요 삭제 중 오류:", error);
                    alert("좋아요 삭제에 실패했습니다.");
                });
        } else {
            // 좋아요 추가 요청
            axios.post(`/api/favorites/auth/accommodations/${id}?email=${userId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    setFavoriteAccommodations((prevFavorites) => [...prevFavorites, id]);
                })
                .catch(error => {
                    console.error("좋아요 추가 중 오류:", error);
                    alert("좋아요 추가에 실패했습니다.");
                });
        }
    };

    // 페이지 번호 렌더링
    const renderPagination = () => {
        const pages = [];
        const startPage = Math.max(0, currentPage - Math.floor(maxPageNumbersToShow / 2));
        const endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i)}>
                        {i + 1}
                    </button>
                </li>
            );
        }

        return (
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                            이전
                        </button>
                    </li>
                    {pages}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                            다음
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    return (
        <div className="container custom-container mt-5">
            {/* 결과 총 숙박 수 표시 */}
            <div className="page-title">숙소 결과 총 {totalAccommodations}개</div>

            <div className="input-group filter-group mb-4">
                <select
                    className="form-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>

                <select
                    className="form-select"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                >
                    <option value="">가격대 선택</option>
                    <option value="0-30000">0 ~ 30,000원</option>
                    <option value="30000-50000">30,000 ~ 50,000원</option>
                    <option value="50000-80000">50,000 ~ 80,000원</option>
                    <option value="80000-100000">80,000 ~ 100,000원</option>
                    <option value="100000-">100,000원 이상</option>
                </select>

                <button className="btn btn-secondary" onClick={() => {
                    setRegion('');
                    setPriceRange('');
                    fetchAccommodations();
                }}>초기화</button>
            </div>

            <div className="row">
                {accommodations && accommodations.length > 0 ? (
                    accommodations.map((accommodation) => (
                        <div key={accommodation.uniqueId} className="col-md-4 mb-4">
                            <Link to={`/accommodation/${accommodation.uniqueId}`} className="card-link">
                                <div className="card h-100 trail-card">
                                    <img
                                        src={(accommodation.imageUrl && accommodation.imageUrl !== '이미지 없음') ? accommodation.imageUrl : '/image/default_image.png'}
                                        className={`card-img-top img-fixed ${!accommodation.imageUrl || accommodation.imageUrl === '이미지 없음' ? 'default-image' : ''}`}
                                        alt={accommodation.name}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <div style={{fontSize:'1.9rem'}} className="card-title course-title">{accommodation.name}</div>
                                        <p style={{fontSize:'1.4rem'}} className="card-text course-overview">{accommodation.address}</p>
                                        <p style={{fontSize:'1.3rem'}} className="trail-info">
                                            1일 평균 숙박가격: {accommodation.averagePrice.toLocaleString()}원
                                        </p>
                                        <div className="mt-auto d-flex align-items-center"
                                             style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <i
                                                className={`bi bi-heart${favoriteAccommodations.includes(accommodation.uniqueId) ? '-fill heart-icon-fill' : ''} heart-icon`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFavoriteToggle(accommodation.uniqueId);
                                                }}
                                            ></i>
                                            <ReviewCount className="btn btn-primary review-btn me-2"
                                                         entityType="accommodations" id={accommodation.uniqueId}/>
                                        </div>
                                        {/* 평균 평점 표시 */}
                                        <AverageRating entityType="accommodations" entityId={accommodation.uniqueId} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No accommodations found</p>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && renderPagination()}
        </div>
    );
};

export default AccommodationList;