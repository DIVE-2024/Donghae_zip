import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [page, setPage] = useState(0); // 페이지 번호 상태 추가
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId'); // 세션에서 userId 가져오기

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            navigate('/login');
        } else {
            // API 호출하여 찜 목록 가져오기
            axios.get('/api/favorites/auth', {
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
                    setWishlist(response.data.content);
                })
                .catch(error => {
                    console.error("찜 목록을 가져오는 중 오류 발생:", error);
                    // 오류 발생 시 로그아웃 후 로그인 페이지로 리디렉션
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('userId');
                    navigate('/login');
                });
        }
    }, [navigate, userId, page]); // page 상태 추가

    return (
        <div>
            <h1>찜 목록</h1>
            {wishlist.length > 0 ? (
                <ul>
                    {wishlist.map(item => (
                        <li key={item.favoriteId}>
                            {item.touristSpot ? <p>관광지: {item.spot.title}</p> : null}
                            {item.accommodation ? <p>숙소: {item.accommodation.name}</p> : null}
                            {item.restaurant ? <p>음식점: {item.restaurant.name}</p> : null}
                            {item.trail ? <p>둘레길: {item.trail.courseName}</p> : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>찜한 항목이 없습니다.</p>
            )}
        </div>
    );
};

export default WishlistPage;