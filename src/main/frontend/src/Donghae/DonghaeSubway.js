import React, { useEffect, useState } from 'react';
import axios from 'axios';
import subwayMap from '../assets/images/동해선_노선도.png'; // 동해선 노선도 이미지

const DonghaeSubway = () => {
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null); // 선택된 역 정보
    const [hoveredStation, setHoveredStation] = useState(null); // 호버된 역 정보
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // 툴팁 위치

    useEffect(() => {
        // 동해선 노선에 속한 모든 역 정보 가져오기
        axios.get("/api/donghae/donghae-line")
            .then((response) => {
                const filteredStations = response.data.filter(station => station.lineName === "동해선");
                setStations(filteredStations); // 동해선에 속한 역 정보를 상태에 저장
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    }, []);

    // 특정 역 정보 가져오기
    const handleStationClick = (stationName) => {
        axios.get(`/api/donghae/${stationName}`)
            .then((response) => {
                setSelectedStation(response.data); // 선택한 역 정보를 상태에 저장
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    };

    const handleMouseEnter = (stationData, event) => {
        setHoveredStation(stationData);
        setTooltipPosition({
            x: event.clientX - 250, // 툴팁이 호버된 위치의 왼쪽에 나타나도록 조정
            y: event.clientY - 80  // 툴팁이 상단에서 약간 떨어진 위치에 나타나도록 조정
        });
    };

    const coordinates = {
        '부전': '320, 715, 390, 775',
        '거제해맞이': '400, 715, 470, 775',
        '거제(법원·검찰청)': '475, 715, 545, 775',
        '교대': '555, 715, 625, 775',
        '동래': '635, 715, 705, 775',
        '안락': '710, 715, 780, 775',
        '부산원동': '790, 715, 860, 775',
        '재송': '870, 715, 940, 775',
        '센텀': '870, 430, 940, 500',
        '벡스코': '770, 430, 840, 500',
        '신해운대': '670, 430, 740, 500',
        '송정': '570, 430, 640, 500',
        '오시리아': '470, 430, 540, 500',
        '기장': '370, 430, 440, 500',
        '일광': '270, 430, 340, 500',
        '좌천': '260, 150, 330, 220',
        '월내': '340, 150, 410, 220',
        '서생': '415, 150, 485, 220',
        '남창': '490, 150, 560, 220',
        '망양': '565, 150, 635, 220',
        '덕하': '635, 150, 705, 220',
        '개운포': '710, 150, 780, 220',
        '태화강': '780, 150, 850, 220'
    };

    // 편의시설을 렌더링하는 함수
    const renderFacilities = (facilitiesJson) => {
        if (!facilitiesJson) return <p>편의시설 정보 없음</p>;

        try {
            const facilities = JSON.parse(facilitiesJson);
            return (
                <ul>
                    {facilities.map((facility, index) => (
                        <li key={index}>
                            {facility.name} (위치: {facility.location}, 층: {facility.floor})
                        </li>
                    ))}
                </ul>
            );
        } catch (error) {
            return <p>편의시설 정보 불러오기 오류</p>;
        }
    };

    return (
        <div style={{ position: 'relative', width: '50%', height: '50%', margin: '0 auto' }}>
            <h1>동해선 노선도</h1>
            {/* 동해선 노선도 이미지 */}
            <img src={subwayMap} alt="동해선 노선도" style={{ width: '100%', height: '100%',borderRadius:'20px',boxShadow:'0px 8px 16px rgba(0, 0, 0, 0.2)'}} />

            {/* 영역을 가시화하기 위한 div 요소들 */}
            {Object.keys(coordinates).map(station => {
                const [x1, y1, x2, y2] = coordinates[station].split(',').map(Number);
                const stationData = stations.find(s => s.stationName === station);

                return (
                    <div
                        key={station}
                        style={{
                            position: 'absolute',
                            left: `${x1}px`,
                            top: `${y1}px`,
                            width: `${x2 - x1}px`,
                            height: `${y2 - y1}px`,
                            cursor: 'pointer' // 커서가 포인터로 변경됨
                        }}
                        onMouseEnter={(e) => handleMouseEnter(stationData, e)}
                        onMouseLeave={() => setHoveredStation(null)}
                        onClick={() => handleStationClick(station)}
                    />
                );
            })}

            {/* 호버된 역 정보 표시 */}
            {hoveredStation && (
                <div
                    style={{
                        position: 'fixed',
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        backgroundColor: 'white',
                        padding: '15px', // 여백을 늘려서 시각적으로 여유 공간을 추가
                        border: '1px solid #ddd', // 더 부드러운 회색 테두리
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // 그림자 추가
                        borderRadius: '8px', // 모서리를 둥글게 처리
                        zIndex: 10,
                        width: '220px' // 툴팁 크기를 좀 더 넓힘
                    }}
                >
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{hoveredStation.stationName}</h3>
                    {hoveredStation.stationImageUrl && (
                        <img src={hoveredStation.stationImageUrl} alt={`${hoveredStation.stationName} 이미지`} style={{ width: '100%', borderRadius: '4px' }} />
                    )}
                    <p style={{ margin: '10px 0 5px 0', fontSize: '14px' }}><strong>지역:</strong> {hoveredStation.region}</p>
                    <p style={{ margin: '0', fontSize: '14px' }}><strong>화장실 이용 가능 여부:</strong> {hoveredStation.toiletAvailability}</p>
                </div>
            )}

            {/* 선택된 역 정보 표시 */}
            {selectedStation && (
                <div>
                    <h2>{selectedStation.stationName} 역 정보</h2>
                    <img src={selectedStation.stationImageUrl} alt={`${selectedStation.stationName} 이미지`}
                         width="300px"/>
                    <p><strong>노선:</strong> {selectedStation.lineName}</p>
                    <p><strong>환승 호선:</strong> {selectedStation.transferAvailable}</p>
                    {selectedStation.transferLine && (
                        <p><strong>환승 노선:</strong> {selectedStation.transferLine}</p>
                    )}
                    <p><strong>운영자:</strong> {selectedStation.railwayOperator}</p>
                    <p><strong>개찰구안 화장실 유무:</strong> {selectedStation.toiletAvailability}</p>
                    <p><strong>주소:</strong> {selectedStation.address}</p>
                    <p><strong>2002년 승차 인원:</strong> {selectedStation.boarding2022}명</p>
                    <p><strong>2002년 하차 인원:</strong> {selectedStation.boarding2022}명</p>
                    <p><strong>2023년 승차 인원:</strong> {selectedStation.boarding2023}명</p>
                    <p><strong>2023년 하차 인원:</strong> {selectedStation.alighting2023}명</p>
                    <h3>편의시설</h3>
                    {renderFacilities(selectedStation.stationFacilities)}
                </div>
            )}
        </div>
    );
};

export default DonghaeSubway;
