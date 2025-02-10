import React, {useEffect, useState} from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 기본 스타일 포함
import ko from 'date-fns/locale/ko'; // 한국어 로케일
import './Step1DateSelection.css';
import axiosInstance from "../../api/axiosInstance";
import ClearIcon from '../../assets/images/clear.png';
import CloudyIcon from '../../assets/images/cloudy.png';
import SnowIcon from '../../assets/images/snow.png';
import RainIcon from '../../assets/images/rain.png';
import ThunderstormIcon from '../../assets/images/lightning.png';
import {getUserIdFromToken} from "../../components/Util/jwtUtils";
import { useNavigate } from "react-router-dom";


registerLocale('ko', ko);

const Step1DateSelection = ({ travel ,startDate, setStartDate, endDate, setEndDate, onNext }) => {
    const [isSelectingStartDate, setIsSelectingStartDate] = useState(true); // 출발날 선택 상태 관리
    const [weatherData, setWeatherData] = useState([]); // 선택된 날의 날씨 데이터
    const [selectedLocation, setSelectedLocation] = useState("Busan"); // 기본값은 부산
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [userId,setUserId] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null); // 출발날 임시 상태
    const [selectedEndDate, setSelectedEndDate] = useState(null); // 도착날 임시 상태
    const [isSaving, setIsSaving] = useState(false); // 저장 상태 관리
    const navigate = useNavigate();


    // 시간을 오전/오후 형식으로 변환
    const formatTime = (time) => {
        const [hour, minute] = time.split(":"); // 시간과 분 추출
        const hourNum = parseInt(hour, 10);
        const isAM = hourNum < 12;
        const formattedHour = hourNum % 12 || 12; // 12시간제 표현 (0시는 12로 변환)
        return `${isAM ? "오전" : "오후"} ${formattedHour}:${minute}`;
    };

    // 이미 저장된 날짜 가져오기
    useEffect(() => {
        const fetchTravelDates = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axiosInstance.get(`/api/travel/${travel.travelId}`, {
                    params: { email: getUserIdFromToken() },
                });

                const { startDate: fetchedStartDate, endDate: fetchedEndDate } = response.data;

                if (fetchedStartDate) setStartDate(new Date(fetchedStartDate));
                if (fetchedEndDate) setEndDate(new Date(fetchedEndDate));
            } catch (error) {
                console.error('Error fetching travel dates:', error);
            }
        };

        fetchTravelDates();
    }, [travel.travelId, setStartDate, setEndDate]);

    // 저장 버튼 클릭 시만 서버에 저장 및 상태 업데이트
    const handleSubmitDates = async () => {
        // 이미 저장 중이라면 실행하지 않음
        if (isSaving) {
            console.log("저장 중입니다. 중복 실행을 방지합니다.");
            return;
        }

        setIsSaving(true); // 저장 중 상태 설정

        try {
            const token = sessionStorage.getItem('token');
            const userId = getUserIdFromToken();

            if (!token || !userId) {
                alert("로그인이 필요합니다.");
                setIsSaving(false); // 저장 상태 해제
                return;
            }

            console.log("Saving dates:", {
                startDate: selectedStartDate.toLocaleDateString("en-CA"),
                endDate: selectedEndDate.toLocaleDateString("en-CA"),
            });

            // 서버에 날짜 저장 요청
            await axiosInstance.patch(
                `/api/travel/${travel.travelId}/dates`,
                {
                    startDate: selectedStartDate.toLocaleDateString("en-CA"), // YYYY-MM-DD 형식
                    endDate: selectedEndDate.toLocaleDateString("en-CA"),
                },
            );

            // 최종적으로 날짜 상태 업데이트
            setStartDate(selectedStartDate);
            setEndDate(selectedEndDate);

            alert("날짜가 저장되었습니다!");
            onNext(); // 다음 단계로 이동
        } catch (error) {
            console.error("Error updating travel dates:", error);
            alert("날짜를 저장하는 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false); // 저장 상태 해제
        }
    };



    const handleResetDates = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const email = getUserIdFromToken(); // JWT에서 이메일 추출
            await axiosInstance.patch(`/api/travel/${travel.travelId}/reset-dates?email=${email}`, null);
            setStartDate(null);
            setEndDate(null);
            alert("날짜가 초기화되었습니다.");
        } catch (error) {
            console.error("Error resetting travel dates:", error);
            alert("날짜 초기화 중 오류가 발생했습니다.");
        }
    };


    const toLocalDate = (date) => {
        // 시간을 초기화하여 UTC 시간을 기준으로 정확히 00:00으로 설정
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const locationTranslations = {
        Busan: "부산",
        Ulsan: "울산",
        // 필요한 지역 추가 가능
    };

    // 날씨 번역 객체
    const weatherTranslations = {
        "clear sky": "맑음",
        "few clouds": "구름 조금",
        "scattered clouds": "흩어진 구름",
        "broken clouds": "구름 많음",
        "shower rain": "소나기",
        "rain": "비",
        "heavy intensity rain": "폭우",
        "moderate rain": "적당한 비",
        "overcast clouds": "흐린 구름",
        "thunderstorm": "천둥번개",
        "snow": "눈",
        "mist": "안개",
    };

    // 날씨 상태와 아이콘 매핑
    const weatherIconMappings = {
        "맑음": ClearIcon,
        "구름 조금": CloudyIcon,
        "흩어진 구름": CloudyIcon,
        "구름 많음": CloudyIcon,
        "흐린 구름": CloudyIcon,
        "안개": CloudyIcon,
        "눈": SnowIcon,
        "소나기": RainIcon,
        "비": RainIcon,
        "폭우": RainIcon,
        "적당한 비": RainIcon,
        "천둥번개": ThunderstormIcon
    };

    // 날짜 선택 시 임시 상태에 저장 (startDate/endDate는 업데이트하지 않음)
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        if (start) setSelectedStartDate(start); // 선택된 출발날 저장
        if (end) setSelectedEndDate(end); // 선택된 도착날 저장
    };

    const fetchWeatherData = async (date, location = "Busan") => {
        try {
            // 로컬 날짜를 yyyy-MM-dd 형식으로 변환
            const formattedDate = date.toLocaleDateString("en-CA"); // yyyy-MM-dd 형식
            const response = await axiosInstance.get('/api/weather', {
                params: {
                    location,
                    date: formattedDate,
                },
            });
            console.log(response);

            if (Array.isArray(response.data) && response.data.length > 0) {
                setWeatherData(response.data);
                setError('');
            } else {
                setWeatherData([]);
                setError(`선택한 날짜의 ${location} 날씨 데이터를 찾을 수 없습니다.`);
            }
        } catch (err) {
            setWeatherData([]);
            setError('날씨 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };


    // 날짜 클릭 시 데이터 가져오기
    const handleDateClick = (date) => {
        if (!date) return;

        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        maxDate.setDate(currentDate.getDate() + 5);

        if (date > maxDate) {
            setError('날씨 데이터는 현재 기준으로 향후 5일까지 제공됩니다.');
            setWeatherData([]);
        } else {
            setError(''); // 이전 에러 초기화
            const localDate = toLocalDate(date); // 로컬 날짜로 변환
            fetchWeatherData(localDate, selectedLocation);
        }
    };

    const maxEndDate = startDate
        ? new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000) // 출발날 + 2일
        : null;

    return (
        <div style={{textAlign: 'center'}}>
            {/* 날짜가 설정된 경우 */}
            {startDate && endDate ? (
                <div>
                    <div style={{fontSize:'2.5rem'}}>여행 날짜가 설정되었습니다.</div>
                    <div style={{fontSize:'2rem'}}>출발날: {startDate.toLocaleDateString()}</div>
                    <div style={{fontSize:'2rem'}}>도착날: {endDate.toLocaleDateString()}</div>
                    <button
                        onClick={handleResetDates}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.2rem',
                            backgroundColor: 'red',
                            color: '#fff',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        일정 초기화
                    </button>
                </div>
            ) : (
                // 날짜가 설정되지 않은 경우
                <div>
                    <div style={{fontSize: '2.5rem', marginBottom: '1rem', color: '#333'}}>
                        여행 일정: <strong>{travel?.title}</strong>
                    </div>
                    <div style={{fontSize: '2.5rem'}}>1. 여행 날짜 선택</div>
                    <p style={{fontSize: '1.5rem'}}>
                        출발날과 도착날을 선택하세요 (최대 <strong style={{color: '#50bcdf'}}>2박 3일</strong> 허용)
                    </p>

                    {/* 지역 선택 버튼 */}
                    <div style={{marginBottom: '1rem'}}>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                marginRight: '1rem',
                                backgroundColor: selectedLocation === 'Busan' ? '#50bcdf' : '#ccc',
                                color: selectedLocation === 'Busan' ? '#fff' : '#000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setSelectedLocation('Busan')}
                        >
                            부산
                        </button>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: selectedLocation === 'Ulsan' ? '#50bcdf' : '#ccc',
                                color: selectedLocation === 'Ulsan' ? '#fff' : '#000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setSelectedLocation('Ulsan')}
                        >
                            울산
                        </button>
                    </div>

                    {/* 날짜 선택 달력 */}
                    <div style={{display: 'flex', justifyContent: 'center', gap: '7rem', marginBottom: '3rem'}}>
                        <div>
                            <DatePicker
                                selected={isSelectingStartDate ? selectedStartDate : selectedEndDate} // 임시 상태 사용
                                onChange={handleDateChange} // 임시 상태 업데이트 함수
                                onSelect={handleDateClick} // 클릭된 날짜 기반으로 날씨 데이터 가져오기
                                startDate={selectedStartDate} // 선택된 출발날
                                endDate={selectedEndDate} // 선택된 도착날
                                selectsRange // 범위 선택 활성화
                                dateFormat="yyyy-MM-dd" // 날짜 포맷
                                minDate={new Date()} // 오늘 이후 날짜만 선택 가능
                                maxDate={maxEndDate} // 최대 도착 날짜 제한
                                inline
                                calendarClassName="large-datepicker"
                                locale="ko"
                            />
                        </div>
                        {weatherData.length > 0 && (
                            <div
                                className="weather-info"
                                style={{
                                    width: '40rem',
                                    backgroundColor: '#FFE3EE',
                                    padding: '3rem',
                                    borderRadius: '3rem',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                <div style={{fontSize: '2.5rem'}}>{weatherData[0].date}일</div>
                                <div style={{fontSize: '2rem'}}>
                                    {locationTranslations[selectedLocation] || selectedLocation} 날씨 정보
                                </div>
                                {weatherData.map((weather, index) => {
                                    const translatedDescription =
                                        weatherTranslations[weather.description] || weather.description;
                                    const weatherIcon = weatherIconMappings[translatedDescription] || ClearIcon;

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                borderBottom: '1px solid #ccc',
                                                marginBottom: '1rem',
                                                marginTop: '1rem',
                                            }}
                                        >
                                            <p style={{fontSize: '1.3rem'}}>{formatTime(weather.time)}</p>
                                            <p style={{fontSize: '1.3rem'}}>
                                                평균 기온: {weather.temperature}°C (도)
                                            </p>
                                            <div
                                                className="weather-container"
                                                style={{display: 'flex', justifyContent: 'center', gap: '2rem'}}
                                            >
                                                <p style={{fontSize: '1.3rem'}}>날씨: {translatedDescription}</p>
                                                <img
                                                    src={weatherIcon}
                                                    alt={translatedDescription}
                                                    className="weather-icon"
                                                    style={{width: '100px', height: '70px'}}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {error && (
                            <div className="error" style={{color: 'red', marginTop: '1rem', fontSize: '1.5rem'}}>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* 버튼 섹션 */}
                    <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem'}}>
                        <button
                            style={{padding: '1rem 2rem', fontSize: '1.2rem'}}
                            onClick={handleSubmitDates}
                            disabled={!selectedStartDate || !selectedEndDate} // 저장 버튼 활성화 조건 변경
                        >
                            날짜 저장
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Step1DateSelection;
