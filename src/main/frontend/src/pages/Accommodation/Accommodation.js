import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map from '../../components/Map/Map';
import AccommodationImage from '../../components/ImageUrl/AccommodationImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AccommodationDetailPage.css';

const Accommodation = () => {
    const { uniqueId } = useParams();
    const [accommodation, setAccommodation] = useState(null);

    useEffect(() => {
        axios.get(`/api/accommodations/${uniqueId}`, {})
            .then(response => {
                const data = response.data;

                // 이미지 URL 필드명 변경 (imageUrl로 처리)
                const parsedAccommodation = {
                    ...data,
                    imageUrl: Array.isArray(data.imageUrl) ? data.imageUrl : [data.imageUrl], // 배열이 아닌 경우 배열로 처리
                    facilities: data.facilities ? JSON.parse(data.facilities) : []
                };

                setAccommodation(parsedAccommodation);
            })
            .catch(error => {
                console.error('Error fetching accommodation data:', error);
            });
    }, [uniqueId]);

    if (!accommodation) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            {/* 숙소명 */}
            <h1 className="accommodation-title text-center mb-4">{accommodation.name}</h1>

            {/* 별 모양 */}
            <div className="text-center mb-2">
                {[...Array(4)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill text-warning"></i>
                ))}
                <i className="bi bi-star text-secondary"></i>
            </div>

            {/* 이미지 출력 */}
            <div className="text-center mb-4">
                <AccommodationImage imageUrls={accommodation.imageUrl} />
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

            {/* 상세 정보 섹션 - 편의시설 포함 */}
            <div className="detail-info-section p-4 mb-5">
                <h4>상세 정보</h4>
                <p><strong>주소:</strong> {accommodation.address}</p>
                <p><strong>전화번호:</strong> {accommodation.phoneNumber}</p>
                <p><strong>웹사이트:</strong> <a href={accommodation.website_url} target="_blank" rel="noopener noreferrer">{accommodation.website_url}</a></p>
                <p><strong>평균 가격:</strong> {accommodation.averagePrice.toLocaleString()}원</p>

                {/* 편의시설 추가 */}
                <h4 className="mt-4">편의시설</h4>
                <ul className="list-inline">
                    {accommodation.facilities.map((facility, index) => (
                        <li key={index} className="list-inline-item badge bg-info text-white me-2 p-2">
                            {facility}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 지도 */}
            <div className="mb-4">
                <h4>위치</h4>
                <Map latitude={accommodation.latitude} longitude={accommodation.longitude} />
            </div>
        </div>
    );
};

export default Accommodation;