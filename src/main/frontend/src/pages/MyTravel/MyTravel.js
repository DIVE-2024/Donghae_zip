import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyTravel.css'; // 스타일링을 위한 CSS 파일
import Step1DateSelection from "./Step1DateSelection";
import Step2RecommendTravel from "./Step2RecommendTravel";

const MyTravel = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // 현재 단계 관리
    const [startDate, setStartDate] = useState(null); // 출발날 상태
    const [endDate, setEndDate] = useState(null); // 도착날 상태

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // 로그인 상태 설정
            setUserId("decodedUserId"); // JWT에서 유저 ID 추출 (parseJwt 활용)
        } else {
            navigate('/login'); // 로그인하지 않은 경우 리다이렉트
        }
    }, [navigate]);

    // 다음 단계로 이동
    const handleNextStep = () => {
        if (currentStep === 1 && (!startDate || !endDate)) {
            alert("출발날과 도착날을 선택하세요."); // 날짜 선택이 안된 경우 경고
            return;
        }
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    // 이전 단계로 이동
    const handlePreviousStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '5rem',
            width: '90%',
            padding: '2rem',
            margin: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            display:'flex',
            justifyContent:'center'
        }}>
            <div style={{backgroundColor:'#DFF6F0',borderRadius:'5rem',width:'80%',alignItems:'center',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
                <div style={{ fontSize: '4rem' }} className="accommodation-title text-center mb-4">
                    동해 출동해!
                </div>

                {isLoggedIn ? (
                    <div>
                        {/* 현재 단계에 따라 렌더링 */}
                        {currentStep === 1 && (
                            <Step1DateSelection
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                onNext={handleNextStep}
                            />
                        )}

                        {/* 현재 단계에 따라 다른 내용 표시 가능 */}
                        {currentStep === 2 && (
                            <Step2RecommendTravel
                                startDate={startDate}
                                endDate={endDate}
                                selectedLocation="Busan" // 사용자 선택 지역
                                onNext={handleNextStep}
                                onPrevious={handlePreviousStep}
                            />
                        )}


                        {/* 이전/다음 버튼 */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                            {currentStep > 1 && (
                                <button
                                    onClick={handlePreviousStep}
                                    style={{
                                        padding: "1rem 2rem",
                                        fontSize: "1rem",
                                        borderRadius: "5px",
                                        backgroundColor: "#ccc",
                                        cursor: "pointer",
                                        margin:'2rem'
                                    }}
                                >
                                    이전
                                </button>
                            )}
                            {currentStep < 5 && (
                                <button
                                    onClick={handleNextStep}
                                    style={{
                                        padding: "1rem 2rem",
                                        fontSize: "1rem",
                                        borderRadius: "5px",
                                        backgroundColor: "#50bcdf",
                                        color: "white",
                                        cursor: "pointer",
                                        margin:'2rem'
                                    }}
                                >
                                    다음
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>로그인이 필요합니다. 로그인 후 이용해주세요.</p>
                )}
            </div>

        </div>
    );
};

export default MyTravel;
