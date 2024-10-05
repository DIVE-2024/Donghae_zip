import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Carousel } from 'react-bootstrap'; // Button 제거
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TouristSpotDetailPage.css';

const TouristSpotDetailPage = () => {
    const { spotId } = useParams(); // URL에서 spotId를 가져옴
    const [spot, setSpot] = useState(null); // API에서 받아온 데이터를 저장할 state
    const [tags, setTags] = useState([]); // 태그 데이터를 저장할 state

    useEffect(() => {
        // spotId를 사용하여 API 호출
        axios.get(`/api/tourist-spots/${spotId}`)
            .then(response => {
                setSpot(response.data); // 받아온 데이터를 state에 저장
            })
            .catch(error => {
                console.error('Error fetching tourist spot data:', error);
            });

        // 태그 데이터를 가져오는 API 호출
        axios.get(`/api/tourist-spots/${spotId}/tags`)
            .then(response => {
                setTags(response.data); // 받아온 태그 데이터를 저장
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
            });
    }, [spotId]);

    if (!spot) {
        return <p>Loading...</p>; // 데이터가 로딩 중일 때 화면에 표시
    }

    return (
        <Container className="tourist-spot-detail-container mt-5">
            {/* 여행지 제목 */}
            <h1 className="spot-detail-title text-center mb-4">{spot.title}</h1>

            {/* 별점 표시 */}
            <div className="text-center mb-2">
                {[...Array(4)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill text-warning"></i>
                ))}
                <i className="bi bi-star text-secondary"></i>
            </div>

            {/* tags 표시 */}
            <div className="text-center mb-4">
                {tags && tags.length > 0 && tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-secondary me-2">{tag}</span> // 태그를 배지 스타일로 표시
                ))}
            </div>

            {/* 이미지 Carousel */}
            <Carousel className="carousel-center mb-4">
                {spot.imageUrls && spot.imageUrls.map((image, idx) => (
                    <Carousel.Item key={idx}>
                        <img
                            className="d-block w-100 spot-image"
                            src={image}
                            alt={`Tourist Spot ${idx + 1}`}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* 상세 정보 */}
            <div className="spot-info-section p-4 mb-5">
                <h4>상세 정보</h4>
                <p><strong>위치:</strong> {spot.address}</p>
                <p><strong>카테고리:</strong> {spot.placeCategory}</p>
                <p><strong>설명:</strong> {spot.oneLineDesc}</p>
                <p><strong>상세 정보:</strong> {spot.detailedInfo}</p>
                <p><strong>실내/실외:</strong> {spot.indoorOutdoor === 'indoor' ? '실내' : '실외'}</p>
            </div>
        </Container>
    );
};

export default TouristSpotDetailPage;