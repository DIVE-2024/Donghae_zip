import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL에서 festivalId를 가져오기 위해 useParams 사용
import axios from 'axios';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './FestivalDetailPage.css'; // 커스텀 CSS

const FestivalDetailPage = () => {
    const { id } = useParams(); // URL에서 festivalId 추출
    const [festival, setFestival] = useState(null);

    useEffect(() => {
        axios.get(`/api/festivals/${id}`)
            .then(response => {
                setFestival(response.data);
            })
            .catch(error => {
                console.error('Error fetching festival data:', error);
            });
    }, [id]);

    if (!festival) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="festival-detail-container mt-5">
            {/* 축제명 */}
            <h1 className="festival-title text-center mb-4">{festival.title}</h1>

            {/* 별 모양 추가 */}
            <div className="text-center mb-2">
                {[...Array(4)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill text-warning"></i>
                ))}
                <i className="bi bi-star text-secondary"></i>
            </div>

            {/* 이미지 출력 */}
            <div className="text-center mb-4">
                {festival.images && festival.images.map((image, idx) => (
                    <img
                        key={idx}
                        className="festival-image mb-3"
                        src={image}
                        alt={`Festival ${idx + 1}`}
                    />
                ))}
            </div>

            {/* 좋아요 및 리뷰 버튼 (이미지와 상세 정보 사이에 위치) */}
            <div className="text-center mb-4">
                <button className="btn btn-outline-primary me-3">
                    <i className="bi bi-heart"></i>
                </button>
                <button className="btn btn-outline-primary">
                    <i className="bi bi-chat"></i>
                </button>
            </div>

            {/* 축제 정보 */}
            <div className="festival-info-section p-4 mb-5">
                <h4>상세 정보</h4>
                <p><strong>기간:</strong> {festival.period}</p>
                <p><strong>장소:</strong> {festival.location}</p>
                <p><strong>홈페이지:</strong> <a href={festival.homepage} target="_blank" rel="noopener noreferrer">{festival.homepage}</a></p>
                <p><strong>상태:</strong> {festival.status === 'PENDING' ? '예정' : festival.status === 'ONGOING' ? '진행 중' : '완료'}</p>
            </div>

        </Container>
    );
};

export default FestivalDetailPage;