import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {getUserIdFromToken} from "../../components/Util/jwtUtils";
import './MyReviewsPage.css';
import StarRating from "../../components/Comment/StarRating";

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);  // 초기 상태는 빈 배열로 설정
    const [filteredReviews, setFilteredReviews] = useState([]); // 필터링된 리뷰 데이터
    const [page, setPage] = useState(0); // 페이지 번호 상태 추가
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가
    const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리
    const navigate = useNavigate();
    const [userId,setUserId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);


        if (!token || !userId) {
            navigate('/login');
        } else {
            // API 호출하여 내가 쓴 리뷰 목록 가져오기
            axios.get('/api/comments/auth/my-reviews', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    email: userId,
                    page: page,
                    size: 10
                }
            })
                .then(response => {
                    console.log("전체 응답:", response.data); // 응답 전체 확인
                    if (response.data.content) {
                        console.log("응답 내 content:", response.data.content);
                        setReviews(response.data.content);
                        setFilteredReviews(response.data.content); // 기본값: 전체 리뷰
                        setTotalPages(response.data.totalPages); // totalPages 설정
                        console.log("총 페이지 수 (백엔드):", response.data.totalPages);
                    } else if (Array.isArray(response.data)) {
                        console.log("응답 데이터가 배열 형태:", response.data);
                        setReviews(response.data);
                        setTotalPages(Math.ceil(response.data.length / 10)); // 임시 계산
                    }
                })
                .catch(error => {
                    console.error("리뷰를 가져오는 중 오류 발생:", error);
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('userId');
                    navigate('/login');
                });
        }
    }, [navigate, userId, page]); // page 상태 추가


    // 카테고리별 리뷰 필터링
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === "전체") {
            setFilteredReviews(reviews); // 전체 데이터 표시
        } else {
            const filtered = reviews.filter(review => {
                switch (category) {
                    case "동해선 숙소.zip":
                        return review.accommodation;
                    case "동해선 축제.zip":
                        return review.festival;
                    case "동해선 맛집.zip":
                        return review.restaurant;
                    case "동해선 관광지.zip":
                        return review.touristSpot;
                    case "동해선 둘렛길.zip":
                        return review.trail;
                    default:
                        return false;
                }
            });
            setFilteredReviews(filtered);
        }
    };

    // 리뷰 대상 이름 가져오기
    const getReviewTargetName = (review) => {
        if (review.accommodation) return `동해선 숙소.zip > ${review.accommodation.name}`;
        if (review.festival) return `동해선 축제.zip > ${review.festival.title}`;
        if (review.restaurant) return `동해선 맛집.zip > ${review.restaurant.name}`;
        if (review.touristSpot) return `동해선 관광지.zip > ${review.touristSpot.title}`;
        if (review.trail) return `동해선 둘렛길.zip > ${review.trail.courseName}`;
        return "대상 정보 없음";
    };

    const getReviewTargetUrl = (review) => {
        const token = sessionStorage.getItem('token'); // 새 창에서도 토큰 전달
        if (!token) {
            console.log("No token found in session storage");
            return null;
        }

        if (review.accommodation) return `/accommodation/${review.accommodation.uniqueId}?token=${token}`;
        if (review.festival) return `/festival/${review.festival.festivalId}?token=${token}`;
        if (review.restaurant) return `/restaurant/${review.restaurant.id}?token=${token}`;
        if (review.touristSpot) return `/tourist-spot/${review.touristSpot.spotId}?token=${token}`;
        if (review.trail) return `/trails/${review.trail.trailId}?token=${token}`;
        return null; // 데이터가 없을 경우
    };

    // 페이지 이동 함수
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title">내가 쓴 리뷰</h2>

            {/* 카테고리 선택 드롭다운 */}
            <div className="filter-container">
                <label htmlFor="category-select">리뷰 필터:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="전체">전체</option>
                    <option value="동해선 숙소.zip">동해선 숙소.zip</option>
                    <option value="동해선 축제.zip">동해선 축제.zip</option>
                    <option value="동해선 맛집.zip">동해선 맛집.zip</option>
                    <option value="동해선 관광지.zip">동해선 관광지.zip</option>
                    <option value="동해선 둘렛길.zip">동해선 둘렛길.zip</option>
                </select>
            </div>

            {Array.isArray(filteredReviews) && filteredReviews.length > 0 ? (
                <div>
                    <ul className="review-list">
                        {filteredReviews.map(review => (
                            <li key={review.commentId} className="review-item">
                                <div className="review-target">
                                    <strong>위치: </strong> {getReviewTargetName(review)}
                                </div>
                                <p className="review-rating">
                                    <StarRating rating={review.rating}/>
                                </p><p className="review-content">리뷰 내용: {review.content}</p>
                                <div className="review-footer">
                                    <p className="review-date" style={{fontSize:'1.3rem'}}>작성일자: {new Date(review.createdAt).toLocaleDateString()}</p>
                                    <a
                                        className="go-to-page-link"
                                        onClick={(e) => {
                                            e.preventDefault(); // 기본 동작 방지
                                            const url = getReviewTargetUrl(review);
                                            if (url) {
                                                window.open(url, '_blank');
                                            }
                                        }}
                                    >
                                        해당 페이지로 이동
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="pagination">
                        <button
                            className="page-button"
                            disabled={page === 0}
                            onClick={() => handlePageChange(page - 1)}>
                            이전 페이지
                        </button>
                        <span className="page-info">{page + 1} / {totalPages}</span>
                        <button
                            className="page-button"
                            disabled={page === totalPages - 1}
                            onClick={() => handlePageChange(page + 1)}>
                            다음 페이지
                        </button>
                    </div>
                </div>
            ) : (
                <p className="no-reviews">선택된 카테고리에 해당하는 리뷰가 없습니다.</p>
            )}
        </div>
    );


};

export default MyReviewsPage;