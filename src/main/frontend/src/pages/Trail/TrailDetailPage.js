import React, { useEffect, useState } from 'react';
import { useParams,useNavigate} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TrailDetailPage.css';
import '../../components/Comment/Comment.css'
import {getUserIdFromToken} from "../../components/Util/jwtUtils";
import ReviewSection from "../../components/Comment/ReviewSection";



const TrailDetailPage = () => {
    const { id } = useParams(); // URL에서 코스 ID 가져오기
    const navigate = useNavigate();
    const [trail, setTrail] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [userId, setUserId] = useState(null);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);

        // 특정 코스의 상세 정보를 가져오는 API 호출
        axios.get(`/api/trails/${id}`)
            .then(response => {
                setTrail(response.data);
            })
            .catch(error => {
                console.error('Error fetching trail data:', error);
            });

        // 해당 코스에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/trails/${id}/reviews`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, [id]);

    if (!trail) {
        return <div>Loading...</div>;
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
                {/* 코스명 */}
                <div style={{fontSize: '4rem'}}
                     className="accommodation-title text-center mb-4">{trail.courseName}</div>

                {/* 평균 별점 표시 */}
                <div className="text-center mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <i key={index} className={`bi ${index < Math.round(averageRating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`} style={{ fontSize: '2.8rem' }}></i>
                    ))}
                    <span style={{ fontSize: '1.5rem', color: '#555', marginLeft: '10px' }}>
                        ({averageRating.toFixed(1)})
                    </span>
                </div>

                {/* 큰 이미지 */}
                <div className="accommodation-detail">
                    <div className="trail-image">
                        <img src={trail.imageUrls[0]} alt={trail.courseName}
                             style={{width: '100%', borderRadius: '1rem'}}/>
                    </div>
                </div>

                {/* 좋아요 및 리뷰 버튼 */}
                <div className="text-center mb-4">
                    <button className="btn btn-outline-primary me-3">
                        <i className="bi bi-heart"></i>
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="bi bi-chat"></i>
                    </button>
                </div>

                {/* 상세 정보 섹션 */}
                <div className="detail-info-section p-4 mb-5" style={{
                    backgroundColor: '#fff5f7', lineHeight: '1.6',
                    textAlign: 'left'
                }}>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>상세 정보
                    </div>
                    <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>코스 개요:</strong> {trail.courseOverview}
                    </p>
                    <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>길이:</strong> {trail.lengthInKm}km</p>
                    <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>소요
                        시간:</strong> {Math.floor(trail.timeInMinutes / 60)}시간 {trail.timeInMinutes % 60}분</p>
                    <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>난이도:</strong> {trail.difficulty}</p>
                    <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>관광 포인트:</strong> {trail.touristPoints}
                    </p>
                    {trail.travelInfo &&
                        <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>여행 정보:</strong> {trail.travelInfo}
                        </p>}
                    <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>시작점:</strong> {trail.startPoint}</p>
                    <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>종점:</strong> {trail.endPoint}</p>
                </div>
            </div>
            {/* 공통 리뷰 섹션 */}
            <ReviewSection entityType="trails" entityId={id} userId={userId} onAverageRatingChange={handleAverageRatingChange}/>
        </div>
    );
};

export default TrailDetailPage;