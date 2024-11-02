import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import subwayMap from '../assets/images/동해선_노선도.png'; // 동해선 노선도 이미지
import Siren from '../assets/images/siren.png';

const DonghaeSubway = () => {
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null); // 선택된 역 정보
    const [hoveredStation, setHoveredStation] = useState(null); // 호버된 역 정보
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const imageRef = useRef(null);

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
        // 초기 화면에 "부전역" 정보를 가져오기 위해 handleStationClick 호출
        handleStationClick("부전");
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

    // 이미지 로드 후 크기를 계산
    const handleImageLoad = () => {
        if (imageRef.current) {
            const { width, height } = imageRef.current.getBoundingClientRect();
            setImageSize({ width, height });
        }
    };

    // 각 역의 좌표를 이미지 비율에 맞게 계산
    const stationPositions = {
        '부전': { x: 0.28, y: 0.95 },
        '거제해맞이': { x: 0.35, y: 0.95 },
        '거제(법원·검찰청)': { x: 0.4, y: 0.95 },
        '교대': { x: 0.5, y: 0.95 },
        '동래': { x: 0.55, y: 0.95 },
        '안락': { x: 0.60, y: 0.95 },
        '부산원동': { x: 0.70, y: 0.95 },
        '재송': { x: 0.75, y: 0.95 },
        '센텀': { x: 0.76, y: 0.60 },
        '벡스코': { x: 0.66, y: 0.60 },
        '신해운대': { x: 0.56, y: 0.60 },
        '송정': { x: 0.5, y: 0.60 },
        '오시리아': { x: 0.4, y: 0.60 },
        '기장': { x: 0.3, y: 0.60 },
        '일광': { x: 0.21, y: 0.60 },
        '좌천': { x: 0.24, y: 0.2 },
        '월내': { x: 0.3, y: 0.2 },
        '서생': { x: 0.36, y: 0.2 },
        '남창': { x: 0.42, y: 0.2 },
        '망양': { x: 0.48, y: 0.2 },
        '덕하': { x: 0.54, y: 0.2 },
        '개운포': { x: 0.6, y: 0.2 },
        '태화강': { x: 0.68, y: 0.2 }
    };

    const renderFacilities = (facilitiesJson) => {
        if (!facilitiesJson) return <p>편의시설 정보 없음</p>;

        try {
            const facilities = JSON.parse(facilitiesJson);
            return (
                <div>
                    <div style={{
                        fontSize: '2.5rem',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '15px'
                    }}>
                        편의시설
                    </div>
                    <ul style={{
                        listStyleType: 'none',
                        paddingLeft: '0',
                        maxWidth: '100%',
                        wordWrap: 'break-word' // 길어진 텍스트를 줄바꿈 처리
                    }}>
                        {facilities.map((facility, index) => (
                            <li key={index} style={{
                                marginBottom: '10px',
                                fontSize: '1.5rem',
                                color: '#555'
                            }}>
                                <strong>{facility.name}</strong> <br />
                                (위치: {facility.location}, 층: {facility.floor})
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } catch (error) {
            return <p>편의시설 정보 불러오기 오류</p>;
        }
    };


    return (
        <div style={{ position: 'relative', width: '50%', height: '50%', marginLeft: '3rem'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{ fontSize: '3.2rem',fontWeight:'bold' }}>동해선 노선도</div>
                <div style={{paddingTop:'1rem',fontSize:'1.2rem'}}><img
                    ref={imageRef}
                    src={Siren}
                    style={{width:'3rem',marginBottom:'0.5rem'}}
                    />
                    동해선을 지나는 역을 클릭해보세요!</div>
            </div>
            <div style={{ display: 'flex', marginBottom:'3rem auto' }}>
                {/* 동해선 노선도 이미지 */}
                <img
                    ref={imageRef}
                    src={subwayMap}
                    alt="동해선 노선도"
                    style={{ width: '100%', height: '100%', borderRadius: '20px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' }}
                    onLoad={handleImageLoad} // 이미지 로드 시 크기 계산
                />

                {/* 클릭 가능한 영역 설정 */}
                {Object.keys(stationPositions).map(station => {
                    const position = stationPositions[station];
                    const stationData = stations.find(s => s.stationName === station);

                    // 이미지 크기와 비율에 따른 좌표 계산
                    const x = position.x * imageSize.width;
                    const y = position.y * imageSize.height;

                    return (
                        <div
                            key={station}
                            style={{
                                position: 'absolute',
                                left: `${x}px`,
                                top: `${y}px`,
                                width: '50px',
                                height: '50px',
                                cursor: 'pointer',
                                backgroundColor: 'rgba(255, 255, 255, 0)' // 투명한 배경
                            }}
                            onMouseEnter={() => setHoveredStation(stationData)}
                            onMouseLeave={() => setHoveredStation(null)}
                            onClick={() => handleStationClick(station)}
                        />
                    );
                })}

                {hoveredStation && (
                    <div
                        style={{
                            position: 'fixed',
                            left: '30px', // 고정된 왼쪽 위치
                            top: '50%', // 화면 중간에 나타나도록
                            transform: 'translateY(-50%)', // 수직 중앙 정렬
                            backgroundColor: 'white',
                            padding: '20px',
                            border: '1px solid #ddd',
                            boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.15)',
                            borderRadius: '12px',
                            zIndex: 10,
                            width: '300px', // 고정된 너비 설정
                            maxHeight: '600px',
                        }}
                    >
                        <p style={{ margin: '0 0 15px 0', fontSize: '2rem' }}>{hoveredStation.stationName}</p>
                        {hoveredStation.stationImageUrl && (
                            <img
                                src={hoveredStation.stationImageUrl}
                                alt={`${hoveredStation.stationName} 이미지`}
                                style={{ width: '250px', height: '180px', borderRadius: '6px', marginBottom: '10px' }}
                            />
                        )}
                        <p style={{ margin: '10px 0 5px 0', fontSize: '1.3rem' }}><strong>지역:</strong> {hoveredStation.region}</p>
                        <p style={{ margin: '0', fontSize: '1.3rem' }}><strong>화장실 이용 가능 여부:</strong> {hoveredStation.toiletAvailability}</p>
                        <p style={{ margin: '0', fontSize: '1.3rem' }}><strong>주소:</strong> {hoveredStation.address}</p>
                    </div>
                )}


                <div style={{ marginLeft: '5rem', width: '100%', backgroundColor: '#fff5f7', borderRadius: '2rem' }}>
                    {/* 선택된 역 정보 표시 */}
                    {selectedStation && (
                        <div style={{width: '60rem',height:'65rem'}}>
                            <div style={{
                                fontSize: '3rem',
                                textAlign: 'center',
                                marginBottom: '40px',
                                fontWeight: 'bold',
                                color: '#333'
                            }}>
                                {selectedStation.stationName}역 정보
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {/* 이미지 섹션 */}
                                <img
                                    style={{borderRadius: '2rem', marginRight: '20px', objectFit: 'cover',marginLeft:'20px'}}
                                    src={selectedStation.stationImageUrl}
                                    alt={`${selectedStation.stationName} 이미지`}
                                    width={'500px'}
                                    height={'360px'}
                                />

                                {/* 승하차 인원 수 섹션 */}
                                <div style={{
                                    backgroundColor: '#f7f7f7',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    fontSize: '1.8rem',
                                    lineHeight: '2.5rem',
                                    paddingLeft: '20px',
                                    maxWidth: '400px'
                                }}>
                                    <div style={{marginBottom: '15px', fontWeight: 'bold', fontSize: '2rem'}}>승차, 하차 인원
                                        수
                                    </div>
                                    <div><strong>2022년 승차 인원:</strong> {selectedStation.boarding2022}명</div>
                                    <div><strong>2022년 하차 인원:</strong> {selectedStation.alighting2022}명</div>
                                    <div><strong>2023년 승차 인원:</strong> {selectedStation.boarding2023}명</div>
                                    <div><strong>2023년 하차 인원:</strong> {selectedStation.alighting2023}명</div>
                                </div>
                            </div>

                            <div style={{display: 'flex',gap:'4.2rem', marginTop: '20px',marginLeft:'20px'}}>
                                {/* 기본 정보 섹션 */}
                                <div style={{
                                    width: '45%',
                                    backgroundColor: '#f7f7f7',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{
                                        fontSize: '2.5rem',
                                        textAlign: 'center',
                                        marginBottom: '20px',
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>기본 정보
                                    </div>
                                    <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}><strong>역
                                        이름:</strong> {selectedStation.stationName}역
                                    </div>
                                    <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}><strong>역
                                        순서:</strong> {selectedStation.stationOrder}번째
                                    </div>
                                    <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}><strong>개찰구안
                                        화장실 유무:</strong> {selectedStation.toiletAvailability}</div>
                                    <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}><strong>환승
                                        호선:</strong> {selectedStation.transferAvailable}</div>
                                    {selectedStation.transferLine && (
                                        <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}><strong>환승
                                            노선:</strong> {selectedStation.transferLine}</div>
                                    )}
                                    <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}>
                                        <strong>주소:</strong> {selectedStation.address}</div>
                                    <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}>
                                        <strong>노선:</strong> {selectedStation.lineName}</div>
                                    <div style={{fontSize: '1.5rem', marginBottom: '10px', color: '#555'}}>
                                        <strong>기관:</strong> {selectedStation.railwayOperator}</div>
                                </div>

                                {/* 편의시설 섹션 */}
                                <div style={{
                                    width: '45%',
                                    backgroundColor: '#f7f7f7',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                    overflow: 'auto', // 길어질 경우 스크롤 처리
                                    maxHeight: '515px', // 최대 높이 제한
                                    wordWrap: 'break-word' // 긴 텍스트 줄바꿈 처리
                                }}>
                                    {renderFacilities(selectedStation.stationFacilities)}
                                </div>

                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonghaeSubway;
