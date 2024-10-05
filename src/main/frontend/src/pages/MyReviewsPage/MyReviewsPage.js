import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);  // 초기 상태는 빈 배열로 설정
    const [page, setPage] = useState(0); // 페이지 번호 상태 추가
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId'); // 세션에서 userId 가져오기

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            navigate('/login');
        } else {
            // API 호출하여 내가 쓴 리뷰 목록 가져오기
            axios.get('/api/comments/auth/my-reviews', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    userId: userId,
                    page: page, // 페이지 번호 전달
                    size: 10    // 페이지 크기 (원하는 대로 변경 가능)
                }
            })
                .then(response => {
                    if (response.data && response.data.content) {
                        setReviews(response.data.content);
                        setTotalPages(response.data.totalPages); // 총 페이지 수 업데이트
                    }
                })
                .catch(error => {
                    console.error("리뷰를 가져오는 중 오류 발생:", error);
                    // 오류 발생 시 로그아웃 후 로그인 페이지로 리디렉션
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('userId');
                    navigate('/login');
                });
        }
    }, [navigate, userId, page]); // page 상태 추가

    // 페이지 이동 함수
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div>
            <h1>내가 쓴 리뷰</h1>
            {Array.isArray(reviews) && reviews.length > 0 ? (
                <div>
                    <ul>
                        {reviews.map(review => (
                            <li key={review.commentId}>
                                <p>리뷰 내용: {review.content}</p>
                                <p>평점: {review.rating}</p>
                                <p>작성일자: {new Date(review.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                    {/* 페이지 이동 버튼 */}
                    <div>
                        <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
                            이전 페이지
                        </button>
                        <span> {page + 1} / {totalPages} </span>
                        <button disabled={page === totalPages - 1} onClick={() => handlePageChange(page + 1)}>
                            다음 페이지
                        </button>
                    </div>
                </div>
            ) : (
                <p>작성한 리뷰가 없습니다.</p>
            )}
        </div>
    );
};

export default MyReviewsPage;