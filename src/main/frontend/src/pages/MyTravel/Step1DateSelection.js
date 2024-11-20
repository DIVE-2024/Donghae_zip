import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 기본 스타일 포함
import ko from 'date-fns/locale/ko'; // 한국어 로케일
import './Step1DateSelection.css';
import axios from "axios";
import ClearIcon from '../../assets/images/맑음.png';
import CloudyIcon from '../../assets/images/흐림.png';
import SnowIcon from '../../assets/images/눈.png';
import RainIcon from '../../assets/images/비.png';
import ThunderstormIcon from '../../assets/images/번개.png';

registerLocale('ko', ko);

const Step1DateSelection = ({ startDate, setStartDate, endDate, setEndDate, onNext }) => {
    const [isSelectingStartDate, setIsSelectingStartDate] = useState(true); // 출발날 선택 상태 관리
    const [weatherData, setWeatherData] = useState([]); // 선택된 날의 날씨 데이터
    const [selectedLocation, setSelectedLocation] = useState("Busan"); // 기본값은 부산
    const [error, setError] = useState(''); // 에러 메시지 상태

    // 시간을 오전/오후 형식으로 변환
    const formatTime = (time) => {
        const [hour, minute] = time.split(":"); // 시간과 분 추출
        const hourNum = parseInt(hour, 10);
        const isAM = hourNum < 12;
        const formattedHour = hourNum % 12 || 12; // 12시간제 표현 (0시는 12로 변환)
        return `${isAM ? "오전" : "오후"} ${formattedHour}:${minute}`;
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
        "천둥번개": ThunderstormIcon
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;

        if (start) {
            setStartDate(toLocalDate(start));
            setIsSelectingStartDate(false);
        }
        if (end) {
            setEndDate(toLocalDate(end));
            setIsSelectingStartDate(true);
        }

    };

    const fetchWeatherData = async (date, location = "Busan") => {
        try {
            // 로컬 날짜를 yyyy-MM-dd 형식으로 변환
            const formattedDate = date.toLocaleDateString("en-CA"); // yyyy-MM-dd 형식
            const response = await axios.get('/api/weather', {
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

    const handleResetDates = () => {
        setStartDate(null); // 출발날 초기화
        setEndDate(null); // 도착날 초기화
        setIsSelectingStartDate(true); // 출발날 선택 상태로 초기화
        setWeatherData([]);
        setError('');
    };

    const maxEndDate = startDate
        ? new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000) // 출발날 + 2일
        : null;

    return (
        <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2.5rem'}}>1. 여행 날짜 선택</div>
            <p style={{fontSize: '1.5rem'}}>출발날과 도착날을 선택하세요 (최대 <strong style={{color: '#50bcdf'}}>2박 3일</strong> 허용)
            </p>

            {/* 지역 선택 버튼 */}
            <div style={{marginBottom: '1rem'}}>
                <button
                    style={{
                        padding: '0.5rem 1rem',
                        marginRight: '1rem',
                        backgroundColor: selectedLocation === "Busan" ? '#50bcdf' : '#ccc',
                        color: selectedLocation === "Busan" ? '#fff' : '#000',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => setSelectedLocation("Busan")}
                >
                    부산
                </button>
                <button
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: selectedLocation === "Ulsan" ? '#50bcdf' : '#ccc',
                        color: selectedLocation === "Ulsan" ? '#fff' : '#000',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => setSelectedLocation("Ulsan")}
                >
                    울산
                </button>
            </div>

            {/* 하나의 달력에서 날짜 범위 선택 */}
            <div style={{display: 'flex', justifyContent: 'center', gap: '7rem',marginBottom:'3rem'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem',alignItems:'center'}}>
                    <DatePicker
                        selected={isSelectingStartDate ? startDate : endDate} // 현재 선택 중인 날짜
                        onChange={handleDateChange}
                        onSelect={handleDateClick} // 날짜 클릭 시 데이터 가져오기
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange // 범위 선택 활성화
                        dateFormat="yyyy-MM-dd" // 날짜 형식
                        minDate={new Date()} // 오늘 이후 날짜만 선택 가능
                        maxDate={maxEndDate} // 최대 2박 3일 제한
                        inline // 달력 인라인 표시
                        calendarClassName="large-datepicker" // 커스텀 스타일 클래스 추가
                        locale="ko" // 한국어 로케일 적용
                    />

                </div>
                {weatherData.length > 0 && (
                    <div className="weather-info" style={{ width:'40rem', backgroundColor: '#FFE3EE', padding: '3rem', borderRadius: '3rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}>
                        <div style={{fontSize:'2.5rem'}}>
                            {weatherData[0].date}일
                        </div> {/* 지역명을 한글로 변환 */}
                        <div style={{fontSize:'2rem'}}>{locationTranslations[selectedLocation] || selectedLocation} 날씨 정보</div>
                        {weatherData.map((weather, index) => {
                            const translatedDescription = weatherTranslations[weather.description] || weather.description; // 번역 찾기
                            const weatherIcon = weatherIconMappings[translatedDescription] || ClearIcon;

                            return (
                                <div key={index}
                                     style={{borderBottom: '1px solid #ccc', marginBottom: '1rem', marginTop: '1rem'}}>
                                    <p style={{fontSize: '1.3rem'}}>{formatTime(weather.time)}</p>
                                    <p style={{fontSize: '1.3rem'}}>평균 기온: {weather.temperature}°C (도)</p>
                                    <div className="weather-container" style={{display:'flex',justifyContent:'center',gap:'2rem'}}>
                                        <p style={{fontSize: '1.3rem'}}>날씨: {translatedDescription}</p>
                                        <img
                                            src={weatherIcon}
                                            alt={translatedDescription}
                                            className="weather-icon"
                                            style={{width: "100px", height: "70px"}}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {error && <div className="error" style={{color: 'red', marginTop: '1rem', fontSize:'1.5rem'}}>{error}</div>}

            </div>
            {/* 날짜 텍스트로 표시 및 수정 */}
            <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center'}}>
                <div>
                    <label htmlFor="start-date" style={{fontSize: '1.5rem'}}>출발날:</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate ? startDate.toLocaleDateString("en-CA") : ''} // yyyy-MM-dd 형식으로 변환
                        onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            newDate.setHours(0, 0, 0, 0); // 자정으로 고정
                            setStartDate(newDate);
                            if (endDate && newDate > endDate) setEndDate(null); // 출발날 이후 도착날 초기화
                        }}
                        min={new Date().toLocaleDateString("en-CA")} // 오늘 이후만 선택 가능
                    />
                </div>
                <div>
                    <label htmlFor="end-date" style={{fontSize: '1.5rem'}}>도착날:</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate ? endDate.toLocaleDateString("en-CA") : ''} // yyyy-MM-dd 형식으로 변환
                        onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            if (startDate && newDate >= startDate) {
                                newDate.setHours(0, 0, 0, 0); // 자정으로 고정
                                setEndDate(newDate);
                            }
                        }}
                        min={startDate ? startDate.toLocaleDateString("en-CA") : ''} // 출발날 이후만 선택 가능
                        max={maxEndDate ? maxEndDate.toLocaleDateString("en-CA") : ''} // 최대 범위 설정
                        disabled={!startDate} // 출발날 선택 전에는 비활성화
                    />
                </div>
        </div>

    {/* 버튼 섹션 */
    }
    <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem'}}>
        <button
            style={{padding: '1rem 2rem', fontSize: '1.2rem'}}
            onClick={onNext}
            disabled={!startDate || !endDate}
        >
            다음 단계로
        </button>
        <button
            style={{
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                backgroundColor: 'red',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
            }}
            onClick={handleResetDates}
        >
            일정 초기화
        </button>
    </div>
</div>
)
    ;
};

export default Step1DateSelection;
