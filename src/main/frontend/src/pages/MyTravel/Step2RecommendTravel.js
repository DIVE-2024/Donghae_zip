import React, { useState, useEffect } from 'react';
import './Step2RecommendTravel.css';
import { useNavigate } from 'react-router-dom'; // React Router에서 useNavigate 가져오기
import Overlay from "../../components/Overlay/Overlay";
import axiosInstance from "../../api/axiosInstance";

const Step2RecommendTravel = ({  travelId, startDate, endDate, selectedLocation, onNext, onPrevious, goToTravelList }) => {
    const [travelDays, setTravelDays] = useState([]); // 날짜별 일정 저장
    const [showOverlay, setShowOverlay] = useState(false); // 오버레이 표시 상태
    const [selectedDay, setSelectedDay] = useState(null); // 선택된 일차 정보
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

    const getCategoryIcon = (category) => {
        const normalizedCategory = normalizeCategory(category);
        switch (normalizedCategory) {
            case "식당":
                return "/image/RestaurantMarker.png";
            case "숙박/휴양":
                return "/image/AccommodaionMarker.png";
            case "여행지":
                return "/image/TouristSpotMarker.png";
            default:
                return "/image/default_image.png";
        }
    };
    const normalizeCategory = (category) => category?.trim()?.toLowerCase();

    const mapPlaceTypeToCategory = (placeType) => {
        switch (placeType) {
            case "RESTAURANT":
                return "식당";
            case "ACCOMMODATION":
                return "숙박/휴양";
            case "TOURIST_SPOT":
                return "여행지";
            default:
                return "기타";
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            generateTravelDays(); // 날짜별 구조 생성
        }
    }, [startDate, endDate]);

    const generateTravelDays = async () => {
        if (!startDate || !endDate) return;

        let days = [];
        let current = new Date(startDate);
        let dayCount = 1;

        while (current <= new Date(endDate)) {
            days.push({
                dayLabel: `${dayCount}일차`,
                date: new Date(current),
                plans: [],
            });
            current.setDate(current.getDate() + 1);
            dayCount++;
        }

        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }

            // 각 날짜별로 데이터를 가져옴
            const updatedTravelDays = await Promise.all(
                days.map(async (day) => {
                    const response = await axiosInstance.get(
                        `/api/travel-detail/travel/${travelId}/date/${day.date.toISOString().split("T")[0]}`);
                    return {
                        ...day,
                        plans: response.data || [], // API 결과 추가
                    };
                })
            );

            setTravelDays(updatedTravelDays); // 상태 업데이트
        } catch (error) {
            console.error("Error fetching travel details:", error);
        }
    };


    const handleSavePlan = async (newPlans, selectedDay) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }

            // 서버에 새로운 일정 저장
            await axiosInstance.post(
                `/api/travel-detail`,
                {
                    travelId: travelId,
                    travelDate: selectedDay.date.toISOString().split("T")[0],
                    plans: newPlans,
                },
            );

            // 저장 성공 후, 오버레이 닫기와 함께 추가된 일정 업데이트
            closeOverlay(newPlans, selectedDay);
        } catch (error) {
            console.error("Error saving plan:", error);
        }
    };

    const openOverlay = (day) => {
        if (!day) {
            console.error("Invalid day provided:", day);
            return;
        }
        setSelectedDay(day); // 선택된 날짜 설정
        setShowOverlay(true); // 오버레이 표시
    };


    const closeOverlay = (newPlans = [], selectedDay) => {
        if (!selectedDay || !selectedDay.date) {
            console.error("Selected day is undefined or invalid:", selectedDay);
            return; // selectedDay가 유효하지 않으면 함수 종료
        }

        setShowOverlay(false); // 오버레이 창 닫기
        setSelectedDay(null); // 선택된 날짜 초기화

        // newPlans가 배열인지 확인하고, 아니라면 빈 배열로 초기화
        const validNewPlans = Array.isArray(newPlans) ? newPlans : [];

        const updatedTravelDays = travelDays.map((day) => {
            if (day.date.toISOString() === selectedDay.date.toISOString()) {
                const mergedPlans = [
                    ...day.plans,
                    ...validNewPlans.filter(
                        (newPlan) => !day.plans.some((plan) => plan.id === newPlan.id)
                    ),
                ];
                return { ...day, plans: mergedPlans };
            }
            return day;
        });

        setTravelDays(updatedTravelDays); // 일정 상태 업데이트
    };


    useEffect(() => {
        console.log("Selected day changed:", selectedDay);
    }, [selectedDay]);


    return (
        <div className="step2-recommend-container">
            <div style={{ fontSize: '2.5rem' }}>2. 여행지 선택</div>
            <p style={{ fontSize: '1.5rem' }}>{`${selectedLocation}에서 ${startDate?.toLocaleDateString()}부터 ${endDate?.toLocaleDateString()}까지의 일정을 짜보세요!`}</p>

            {/* 여행 목록으로 돌아가기 버튼 */}
            <button
                onClick={goToTravelList} // 여행 목록으로 돌아가기
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1.2rem',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                }}
            >
                여행 목록으로 돌아가기
            </button>

            {/* 날짜별 일정 섹션 */}
            <div className="travel-days-container">
                {travelDays.map((day, index) => (
                    <div key={index} className="travel-day-card">
                        <h3>{day.dayLabel}</h3>
                        <p>{day.date.toLocaleDateString()}</p>

                        <div className="plans-list">
                            {day.plans.length > 0 ? (
                                day.plans.map((plan, idx) => (
                                    <div key={idx} className="plan-item" style={{fontSize: '1.5rem'}}>
                                        {/* 시간 */}
                                        <span
                                            className="plan-time">{`${plan.startTime || '00:00'} ~ ${plan.endTime || '00:00'}`}
                                        </span>
                                        <img
                                            src={getCategoryIcon(mapPlaceTypeToCategory(plan.placeType))}
                                            alt={`${plan.placeType} icon`}
                                            className="plan-icon"
                                        />
                                        {/* 장소 */}
                                        <span className="plan-title">{plan.placeTitle || '일정 정보 없음'}</span>
                                    </div>
                                ))
                            ) : (
                                <p>추가된 일정이 없습니다.</p>
                            )}
                        </div>


                        <button
                            onClick={() => openOverlay(day)}
                            className="add-plan-button"
                        >
                            일정 추가
                        </button>
                    </div>
                ))}
            </div>
            {/* 오버레이 창 */}
            {showOverlay && selectedDay && (
                <Overlay
                    travelId={travelId}
                    closeOverlay={(newPlans) => closeOverlay(newPlans, selectedDay)} // selectedDay를 명시적으로 전달
                    selectedDay={selectedDay}
                    onSavePlan={(newPlans) => handleSavePlan(newPlans, selectedDay)}
                />
            )}
        </div>
    );
};

export default Step2RecommendTravel;
