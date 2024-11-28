import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Step0TravelList.css'; // 스타일링 파일
import {getUserIdFromToken} from "../../components/Util/jwtUtils";
import OverlayCreateTravel from "../../components/Overlay/OverlayCreateTravel";

const Step0TravelList = ({ nickname, onNext }) => {
    const [travelList, setTravelList] = useState([]); // 여행 목록 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // 오버레이 열림 상태
    const [userId,setUserId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);
        const fetchTravelList = async () => {
            try {
                const response = await axios.get(`/api/travel/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                setTravelList(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching travel list:', error);
                setTravelList([]);
                setLoading(false);
            }
        };

        fetchTravelList();
    }, [userId]);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', options);
    };

    // 새로운 여행 생성
    const handleCreateTravel = async (title) => {
        try {
            const response = await axios.post(
                `/api/travel?email=${userId}`,
                {
                    title: title, // 입력한 여행 이름
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                }
            );
            // 새로운 여행을 목록에 추가
            console.log("Travel created:", response.data);
            setTravelList((prev) => [...prev, response.data]);
            setIsOverlayOpen(false); // 오버레이 닫기
        } catch (error) {
            console.error('Error creating travel:', error);
            alert('일정 생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleCreateNewTravel = () => {
        onNext(); // 다음 단계로 이동
    };

    return (
        <div className="travel-list-container">
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem' }}>여행 일정 목록</div>
                {loading ? (
                    <p>로딩 중...</p>
                ) : travelList.length === 0 ? (
                    <div>
                        <p style={{ fontSize: '2rem', margin: '2rem 0' }}>
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
                            onClick={() => setIsOverlayOpen(true)} // 오버레이 열기
                        >
                            여행 일정 생성하기
                        </button>
                    </div>
                ) : (
                    <div>
                        {travelList.map((travel) => (
                            <div key={travel.travelId} className="travel-item">
                                <div className="travel-item-header">
                                    <div className="travel-item-title">{travel.title}</div>
                                    <div>최종 수정일: {formatDate(travel.updatedAt)}</div>
                                </div>
                                <div className="travel-item-buttons">
                                    <button
                                        className="travel-item-button"
                                        onClick={() => console.log(`View details for ID: ${travel.travelId}`)}
                                    >
                                        보기
                                    </button>
                                    <button
                                        className="travel-item-button"
                                        onClick={() => onNext(travel)} // 선택한 여행 데이터를 전달
                                    >
                                        다음 단계로
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* 여행 일정 생성 버튼 */}
                        <button
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.2rem',
                                backgroundColor: '#50bcdf',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '2rem',
                            }}
                            onClick={() => setIsOverlayOpen(true)} // 오버레이 열기
                        >
                            새로운 여행 생성
                        </button>
                    </div>
                )}
            </div>

            {/* OverlayCreateTravel 컴포넌트 사용 */}
            <OverlayCreateTravel
                isOpen={isOverlayOpen} // 오버레이 열림 상태 전달
                onClose={() => setIsOverlayOpen(false)} // 오버레이 닫기
                onSave={handleCreateTravel} // 여행 생성 로직 전달
            />
        </div>
    );
};

export default Step0TravelList;
