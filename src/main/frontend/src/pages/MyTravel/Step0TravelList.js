import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Step0TravelList.css'; // 스타일링 파일
import {getUserIdFromToken} from "../../components/Util/jwtUtils";

const Step0TravelList = ({ userId, nickname, onNext }) => {
    const [travelList, setTravelList] = useState([]); // 여행 목록 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        const fetchTravelList = async () => {
            try {
                const response = await axios.get(`/api/travel/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`, // JWT 토큰 추가
                    },
                });
                setTravelList(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching travel list:', error);
                setTravelList([]);
                setLoading(false);
            }
        };

        fetchTravelList();
    }, [userId]);

    const handleCreateNewTravel = () => {
        onNext(); // 다음 단계로 이동
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>여행 일정 목록</div>
            {loading ? (
                <p>로딩 중...</p>
            ) : travelList.length === 0 ? (
                <div>
                    <p style={{fontSize: '2rem', margin: '2rem 0'}}>
                        {`${nickname}님의 여행 일정을 짜보세요!`}
                    </p>
                    <button
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.2rem',
                            backgroundColor: '#50bcdf',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={handleCreateNewTravel}
                    >
                        여행 일정 생성하기
                    </button>
                </div>
            ) : (
                <div>
                    {travelList.map((travel, index) => (
                        <div
                            key={travel.travelId}
                            style={{
                                padding: '1rem',
                                margin: '1rem 0',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: '#f9f9f9',
                                textAlign: 'left',
                                width: '80%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        >
                            <h3>{travel.travelName}</h3>
                            <p>
                                {`기간: ${travel.startDate} ~ ${travel.endDate}`}
                            </p>
                            <button
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#50bcdf',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: '1rem',
                                }}
                                onClick={() => {
                                    // 여행 상세로 이동
                                    console.log(`View details for travel ID: ${travel.travelId}`);
                                }}
                            >
                                자세히 보기
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Step0TravelList;
