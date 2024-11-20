import React, { useState, useEffect } from 'react';
import './Step2RecommendTravel.css';
import Overlay from "../../components/Overlay/Overlay";


const Step2RecommendTravel = ({ startDate, endDate, selectedLocation, onNext, onPrevious }) => {
    const [travelDays, setTravelDays] = useState([]); // 날짜별 일정 저장
    const [showOverlay, setShowOverlay] = useState(false); // 오버레이 표시 상태
    const [selectedDay, setSelectedDay] = useState(null); // 선택된 일차 정보

    useEffect(() => {
        if (startDate && endDate) {
            generateTravelDays();
        }
    }, [startDate, endDate]);

    const generateTravelDays = () => {
        const days = [];
        let current = new Date(startDate);
        let dayCount = 1;

        while (current <= new Date(endDate)) {
            days.push({
                dayLabel: `${dayCount}일차`,
                date: new Date(current),
                plans: [], // 일정 데이터
            });
            current.setDate(current.getDate() + 1); // 다음 날로 이동
            dayCount++;
        }

        setTravelDays(days);
    };

    const openOverlay = (day) => {
        setSelectedDay(day);
        setShowOverlay(true);
    };

    const closeOverlay = () => {
        setShowOverlay(false);
        setSelectedDay(null);
    };

    return (
        <div className="step2-recommend-container">
            <div style={{ fontSize: '2.5rem' }}>2. 여행지 선택</div>
            <p style={{ fontSize: '1.5rem' }}>{`${selectedLocation}에서 ${startDate?.toLocaleDateString()}부터 ${endDate?.toLocaleDateString()}까지의 일정을 짜보세요!`}</p>

            {/* 날짜별 일정 섹션 */}
            <div className="travel-days-container">
                {travelDays.map((day, index) => (
                    <div key={index} className="travel-day-card">
                        <h3>{day.dayLabel}</h3>
                        <p>{day.date.toLocaleDateString()}</p>

                        {day.plans.length === 0 ? (
                            <button
                                onClick={() => openOverlay(day)}
                                className="add-plan-button"
                            >
                                일정 추가
                            </button>
                        ) : (
                            <div className="plans-list">
                                {day.plans.map((plan, idx) => (
                                    <div key={idx} className="plan-item">
                                        {plan.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* 오버레이 창 */}
            {showOverlay && (
                <Overlay
                    closeOverlay={closeOverlay}
                    selectedDay={selectedDay}
                />
            )}
        </div>
    );
};

export default Step2RecommendTravel;
