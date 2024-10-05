import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map from '../../components/Map/Map';
import RestaurantImage from '../../components/ImageUrl/RestaurantImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './RestaurantDetailPage.css';  // 새로운 CSS 파일

const Restaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        axios.get(`/api/restaurants/${id}`, {})
            .then(response => {
                const data = response.data;

                const parsedRestaurant = {
                    ...data,
                    imageUrl: JSON.parse(data.imageUrl),
                    businessHours: JSON.parse(data.businessHours),
                    info: JSON.parse(data.info),
                    menuInfo: JSON.parse(data.menuInfo),
                    tags: JSON.parse(data.tags)
                };

                setRestaurant(parsedRestaurant);
            })
            .catch(error => {
                console.error('Error fetching restaurant data:', error);
            });
    }, [id]);

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">
            {/* 식당명 */}
            <h1 className="restaurant-title text-center mb-2">{restaurant.name}</h1>

            {/* 해시태그 */}
            <div className="text-center mb-2">
                {restaurant.tags && restaurant.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary me-1">#{tag}</span>
                ))}
            </div>

            {/* 별 모양 */}
            <div className="text-center mb-2">
                {[...Array(4)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill text-warning"></i>
                ))}
                <i className="bi bi-star text-secondary"></i>
            </div>

            {/* 이미지 출력 */}
            <div className="text-center mb-4">
                {restaurant.imageUrl && <RestaurantImage imageUrls={restaurant.imageUrl} />}
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
            <div className="detail-info-section p-4 mb-5">
                <h4>상세 정보</h4>
                <p><strong>주소:</strong> {restaurant.address}</p>
                <p><strong>전화번호:</strong> {restaurant.phone}</p>
                <p><strong>영업시간:</strong></p>
                <ul>
                    {restaurant.businessHours.map((hour, index) => (
                        <li key={index}>{hour}</li>
                    ))}
                </ul>

                {/* 메뉴 정보 */}
                <h4>메뉴 정보</h4>
                <ul>
                    {restaurant.menuInfo.map((menu, index) => (
                        <li key={index}>{menu}</li>
                    ))}
                </ul>
            </div>

            {/* 지도 출력 */}
            <div className="mb-4">
                <h4>위치</h4>
                <Map latitude={restaurant.latitude} longitude={restaurant.longitude} />
            </div>
        </div>
    );
};

export default Restaurant;
