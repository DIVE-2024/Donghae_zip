import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom'; // URL에서 festivalId를 가져오기 위해 useParams 사용
import axios from 'axios';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './FestivalDetailPage.css';
import {getUserIdFromToken} from "../../components/Util/jwtUtils";
import ReviewSection from "../../components/Comment/ReviewSection";
import AverageRating from "../../components/Comment/AverageRating";

const FestivalDetailPage = () => {
    const { id } = useParams(); // URL에서 festivalId 추출
    const navigate = useNavigate();
    const [festival, setFestival] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [userId, setUserId] = useState(null);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);

        axios.get(`/api/festivals/${id}`)
            .then(response => {
                setFestival(response.data);
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching festival data:', error);
            });
        // 해당 코스에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/festivals/${id}/reviews`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, [id]);

    if (!festival) {
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
        <div style={{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '5rem',
            width: '90%',
            padding: '2rem',
            margin: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
        }}>
            <Container className="festival-detail-container mt-5" style={{maxWidth: '100%'}}> {/* maxWidth를 100%로 설정 */}
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
                {/* 축제명 */}
                <div style={{fontSize: '4rem'}} className="festival-title text-center mb-4">{festival.title}</div>
                {/* 평균 별점 표시 */}
                <AverageRating entityType="festivals" entityId={festival.festivalId} fontSize="2.5rem" />
                <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                    {/* 이미지 출력 */}
                    <div className="text-center mb-4" style={{flex: 1}}>
                        {festival.images && festival.images.map((image, idx) => (
                            <img
                                key={idx}
                                className="festival-image mb-3"
                                src={image}
                                alt={`Festival ${idx + 1}`}
                                style={{maxWidth: '100%'}}
                            />
                        ))}
                        <div className="text-center mb-4">
                            <button className="btn btn-outline-primary me-3">
                                <i className="bi bi-heart"></i>
                            </button>
                            <button className="btn btn-outline-primary">
                                <i className="bi bi-chat"></i>
                            </button>
                        </div>
                    </div>

                    <div className="festival-info-section p-4 mb-5" style={{
                        flex: 1,  /* 축제 정보 섹션도 이미지와 같은 크기로 설정 */
                        margin: '6rem',
                        lineHeight: '1.6',
                        textAlign: 'left',
                        marginBottom: '2rem',
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>상세 정보
                        </div>
                        <p><strong>축제명:</strong> {festival.title}</p>
                        <p><strong>축제 시기:</strong> {festival.date}</p>
                        <p><strong>기간:</strong> {festival.period}</p>
                        <p><strong>장소:</strong> {festival.location}</p>
                        <p><strong>홈페이지:</strong> <a href={festival.homepage} target="_blank"
                                                     rel="noopener noreferrer">{festival.homepage}</a></p>
                        <p>
                            <strong>상태:</strong> {festival.status === 'PENDING' ? '예정' : festival.status === 'ONGOING' ? '진행 중' : '완료'}
                        </p>
                    </div>
                </div>
                {/* 공통 리뷰 섹션 */}
                <ReviewSection entityType="festivals" entityId={id} userId={userId} onAverageRatingChange={handleAverageRatingChange}/>
            </Container>
        </div>

    );
};

export default FestivalDetailPage;