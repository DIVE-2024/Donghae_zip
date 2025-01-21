import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Map from '../../components/Map/Map';
import RestaurantImage from '../../components/ImageUrl/RestaurantImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './RestaurantDetailPage.css';
import {getUserIdFromToken} from "../../components/Util/jwtUtils";
import ReviewSection from "../../components/Comment/ReviewSection";
import TokenHandler from "../../components/Util/TokenHandler";

const Restaurant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [userId, setUserId] = useState(null);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const userIdFromToken = getUserIdFromToken();
            if (userIdFromToken) setUserId(userIdFromToken);

            try {
                const restaurantResponse = await axios.get(`/api/restaurants/${id}`);
                const data = restaurantResponse.data;

                const parsedRestaurant = {
                    ...data,
                    imageUrl: JSON.parse(data.imageUrl),
                    businessHours: JSON.parse(data.businessHours),
                    info: JSON.parse(data.info),
                    menuInfo: JSON.parse(data.menuInfo),
                    tags: JSON.parse(data.tags),
                };

                setRestaurant(parsedRestaurant);

                const commentsResponse = await axios.get(`/api/comments/restaurants/${id}/reviews`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);


    if (!restaurant) {
        return <p>Loading...</p>;
    }

    // 평균 평점 변경 시 호출될 함수
    const handleAverageRatingChange = (newAverageRating) => {
        setAverageRating(newAverageRating);
    };

    //이전 페이지로 넘어가는 함수
    const handleBack = () => {
        navigate(-1);
    };


    return (
        <div style={{backgroundColor:'white',borderRadius:'5rem',width:'90%',padding:'2rem',margin:'auto',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
            <TokenHandler/>
            <div className="container mt-5">
                <button className="btn btn-primary" onClick={handleBack}
                        style={{
                            marginBottom: '20px',
                            padding: '10px 20px',
                            fontSize: '1.6rem',
                            cursor: 'pointer',
                            display: 'flex'
                        }}>
                    뒤로 가기
                </button>
                {/* 식당명 */}
                <div style={{fontSize: '4rem'}} className="text-center mb-2">{restaurant.name}</div>

                {/* 해시태그 */}
                <div className="text-center mb-2">
                    {restaurant.tags && restaurant.tags.map((tag, index) => (
                        <span style={{height: '3rem', fontSize: '1.5rem', padding: '10px', textAlign: 'center'}}
                              key={index} className="badge bg-secondary me-1">#{tag}</span>
                    ))}
                </div>

                {/* 평균 별점 표시 */}
                <div className="text-center mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <i key={index} className={`bi ${index < Math.round(averageRating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`} style={{ fontSize: '2.8rem' }}></i>
                    ))}
                    <span style={{ fontSize: '1.5rem', color: '#555', marginLeft: '10px' }}>
                        ({averageRating.toFixed(1)})
                    </span>
                </div>

                {/* 이미지 출력 */}
                <div className="restaurant-detail">
                    <div className="restaurant-image">
                        {restaurant.imageUrl && <RestaurantImage imageUrls={restaurant.imageUrl}/>}
                    </div>
                </div>

                {/* 좋아요 및 공유 버튼 */}
                <div className="text-center mb-4">
                    <button className="btn btn-outline-primary me-3">
                        <i className="bi bi-heart"></i>
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="bi bi-share"></i>
                    </button>
                </div>

                {/* 상세 정보 섹션 */}
                <div style={{display: 'flex', gap: '8rem', width: '120%', marginLeft: '-3rem'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className='spot-info-section' style={{
                            marginBottom: '2rem',
                            width: '50rem',
                            lineHeight: '1.6',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>상세 정보
                            </div>

                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}>
                                <strong>해시태그:</strong> {restaurant.hashtag}</p>
                            <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                                <strong>식당명:</strong> {restaurant.name}</p>
                            <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                                <strong>전화번호:</strong> {restaurant.phone}</p>
                            <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}><strong>영업시간:</strong></p>
                            <ul style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                                {restaurant.businessHours.map((hour, index) => (
                                    <li key={index}>{hour}</li>
                                ))}
                            </ul>

                            {/* 메뉴 정보 */}
                            <h4>메뉴 정보</h4>
                            <ul style={{
                                maxHeight: '500px',  // 최대 높이를 설정하여 스크롤 가능하게 함
                                overflowY: 'auto',    // 내용이 많으면 스크롤 추가
                                fontSize: '1.5rem',
                                marginBottom: '1rem',
                                paddingRight: '1rem'  // 스크롤바와 텍스트가 겹치지 않도록 패딩 추가
                            }}>
                                {restaurant.menuInfo.map((menu, index) => (
                                    <li style={{marginBottom: '1rem'}} key={index}>{menu}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* 지도 출력 */}
                    <div style={{
                        backgroundColor: '#fff5f7',
                        borderRadius: '20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
                        height: '40rem',
                        margin: 'auto',
                        width: '40rem'
                    }}>
                        <div className="map-style" style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <div style={{gap: '1rem', marginBottom: '2rem'}}>
                                <div style={{fontSize: '2.5rem', textAlign: 'center', fontWeight: 'bold'}}>위치</div>
                                <div style={{fontSize: '1.5rem', paddingTop: '12px'}}>주소: {restaurant.address}</div>
                            </div>
                            <Map latitude={restaurant.latitude} longitude={restaurant.longitude}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 공통 리뷰 섹션 */}
            <ReviewSection
                entityType="restaurants"
                entityId={id}
                userId={userId}
                onAverageRatingChange={handleAverageRatingChange} // 평균 평점 변경 함수 전달
            />
        </div>
    );
};

export default Restaurant;