import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Map from '../../components/Map/Map';
import AccommodationImage from '../../components/ImageUrl/AccommodationImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AccommodationDetailPage.css';
import {getUserIdFromToken} from "../../components/Util/jwtUtils";
import ReviewSection from "../../components/Comment/ReviewSection";

const Accommodation = () => {
    const { uniqueId } = useParams();
    const navigate = useNavigate();
    const [accommodation, setAccommodation] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [userId, setUserId] = useState(null);
    const [averageRating, setAverageRating] = useState(0);


    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);

        axios.get(`/api/accommodations/${uniqueId}`, {})
            .then(response => {
                const data = response.data;
                console.log(response);

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

        // 해당 코스에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/accommodations/${uniqueId}/reviews`)
            .then(response => {
                console.log("댓글 API 응답 데이터: ", response.data);
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, [uniqueId]);

    if (!accommodation) {
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
                {/* 숙소명 */}
                <div style={{fontSize: '4rem'}}
                     className="accommodation-title text-center mb-4">{accommodation.name}</div>

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
                <div className="accommodation-detail">
                    <div className="accommodation-image">
                        <AccommodationImage imageUrls={accommodation.imageUrl}/>
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

                <div style={{display: 'flex', gap: '8rem', width: '120%', marginLeft: '-3rem', marginBottom: '3rem'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className='spot-info-section' style={{
                            marginBottom: '2rem',
                            width: '40rem',
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
                                <strong>숙소명:</strong> {accommodation.name}</p>
                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}>
                                <strong>전화번호:</strong> {accommodation.phoneNumber}</p>
                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>웹사이트:</strong> <a
                                href={accommodation.website_url} target="_blank"
                                rel="noopener noreferrer">{accommodation.website_url}</a></p>
                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>평균
                                가격:</strong> {accommodation.averagePrice.toLocaleString()}원</p>

                            {/* 편의시설 추가 */}
                            <h4 className="mt-4">편의시설</h4>
                            <ul className="list-inline">
                                {accommodation.facilities.map((facility, index) => (
                                    <li key={index} style={{fontSize: '1.7rem', margin: '5px'}}
                                        className="list-inline-item badge bg-info text-white me-2 p-2">
                                        {facility}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* 지도 */}
                    <div style={{
                        backgroundColor: '#fff5f7',
                        padding: '3rem',
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
                            flexDirection: 'column',
                            height: '31rem',
                            width: '35rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '2rem',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{fontSize: '2.5rem', textAlign: 'center', fontWeight: 'bold'}}>위치</div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    paddingTop: '12px',
                                    wordBreak: 'break-word'
                                }}>
                                    주소: {accommodation.address}
                                </div>
                            </div>

                            <Map latitude={accommodation.latitude} longitude={accommodation.longitude}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 공통 리뷰 섹션 */}
            <ReviewSection entityType="accommodations" entityId={uniqueId} userId={userId} onAverageRatingChange={handleAverageRatingChange}/>
        </div>
    );
};

export default Accommodation;