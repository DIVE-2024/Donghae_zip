import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map from '../Map/Map';
import RestaurantImage from '../ImageUrl/RestaurantImage';

const Restaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        axios.get(`/api/restaurants/${id}`, {})
            .then(response => {
                const data = response.data;

                // 각 문자열을 배열로 변환
                const parsedRestaurant = {
                    ...data,
                    imageUrl: JSON.parse(data.imageUrl),
                    businessHours: JSON.parse(data.businessHours),
                    info: JSON.parse(data.info),
                    menuInfo: JSON.parse(data.menuInfo),
                    tags: JSON.parse(data.tags)
                };

                setRestaurant(parsedRestaurant);
                console.log(parsedRestaurant); // 파싱된 데이터 확인
            })
            .catch(error => {
                console.error('Error fetching restaurant data:', error);
            });
    }, [id]);

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{restaurant.hashtag}</h1>
            <h2>{restaurant.name}</h2>

            {/* 이미지 갤러리 */}
            {restaurant.imageUrl && <RestaurantImage imageUrls={restaurant.imageUrl} />}

            {/* 영업시간 */}
            <p>영업시간:</p>
            <ul>
                {restaurant.businessHours.map((hour, index) => (
                    <li key={index}>{hour}</li>
                ))}
            </ul>

            <p>Address: {restaurant.address}</p>
            <p>Phone: {restaurant.phone}</p>

            {/* 메뉴 정보 */}
            <p>메뉴정보:</p>
            <ul>
                {restaurant.menuInfo.map((menu, index) => (
                    <li key={index}>{menu}</li>
                ))}
            </ul>

            {/* 지도 컴포넌트 */}
            <Map latitude={restaurant.latitude} longitude={restaurant.longitude} />
        </div>
    );
};

export default Restaurant;
