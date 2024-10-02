import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map from '../Map/Map';
import AccommodationImage from '../ImageUrl/AccommodationImage';

const Accommodation = () => {
    const { uniqueId } = useParams();  // URL에서 unique_id를 가져옴
    const [accommodation, setAccommodation] = useState(null);

    useEffect(() => {
        axios.get(`/api/accommodations/${uniqueId}`, {})
            .then(response => {
                const data = response.data;

                // JSON으로 파싱이 필요한 필드들 처리, 값이 존재할 때만 JSON.parse 수행
                const parsedAccommodation = {
                    ...data,
                    image_url: data.image_url ? JSON.parse(data.image_url) : [],
                    facilities: data.facilities ? JSON.parse(data.facilities) : []
                };

                setAccommodation(parsedAccommodation);  // 파싱된 숙박시설 데이터를 저장
                console.log(parsedAccommodation);
            })
            .catch(error => {
                console.error('Error fetching accommodation data:', error);
            });
    }, [uniqueId]);

    if (!accommodation) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>#{accommodation.region}</h1>
            <h2>{accommodation.name}</h2>

            {/* 이미지 출력 */}
            {accommodation.imageUrl && <AccommodationImage imageUrls={accommodation.imageUrl} />}
            {/* 기본 정보 출력 */}
            <p>웹사이트: {accommodation.websiteUrl}</p>
            <p>주소: {accommodation.address}</p>
            <p>전화번호: {accommodation.phoneNumber}</p>
            {accommodation.website_url && <p>웹사이트: <a href={accommodation.website_url} target="_blank" rel="noopener noreferrer">{accommodation.website_url}</a></p>}
            <p>평균 가격: {accommodation.averagePrice}원</p>

            {/* 편의시설 출력 */}
            <h3>편의시설:</h3>
            <ul>
                {accommodation.facilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                ))}
            </ul>

            {/* 지도 출력 */}
            <Map latitude={accommodation.latitude} longitude={accommodation.longitude} />
        </div>
    );
};

export default Accommodation;
