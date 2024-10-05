import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TrailDetailPage.css';

const TrailDetailPage = () => {
    const { id } = useParams(); // URL에서 코스 ID 가져오기
    const [trail, setTrail] = useState(null);

    useEffect(() => {
        // 특정 코스의 상세 정보를 가져오는 API 호출
        axios.get(`/api/trails/${id}`)
            .then(response => {
                setTrail(response.data);
            })
            .catch(error => {
                console.error('Error fetching trail data:', error);
            });
    }, [id]);

    if (!trail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            {/* 코스명 */}
            <h1 className="trail-title text-center mb-4">{trail.courseName}</h1>

            {/* 별 모양 */}
            <div className="text-center mb-2">
                {[...Array(3)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill text-warning"></i>
                ))}
            </div>

            {/* 큰 이미지 */}
            <div className="text-center mb-4">
                <img src={trail.imageUrls[0]} className="img-fluid detail-image" alt={trail.courseName} />
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

            {/* 상세 정보 섹션 */}
            <div className="detail-info-section p-4 mb-5"> {/* mb-5로 여백 추가 */}
                <h4>상세 정보</h4>

                {/* Course Overview */}
                <p><strong>코스 개요:</strong> {trail.courseOverview}</p>

                {/* Length, Time, Difficulty */}
                <p><strong>길이:</strong> {trail.lengthInKm}km</p>
                <p><strong>소요 시간:</strong> {Math.floor(trail.timeInMinutes / 60)}시간 {trail.timeInMinutes % 60}분</p>
                <p><strong>난이도:</strong> {trail.difficulty}</p>

                {/* Tourist Points */}
                <p><strong>관광 포인트:</strong> {trail.touristPoints}</p>

                {/* Travel Info */}
                {trail.travelInfo && (
                    <p><strong>여행 정보:</strong> {trail.travelInfo}</p>
                )}

                {/* Start and End Points */}
                <p><strong>시작점:</strong> {trail.startPoint}</p>
                <p><strong>종점:</strong> {trail.endPoint}</p>
            </div>
        </div>
    );
};

export default TrailDetailPage;