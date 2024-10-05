import React, {useEffect, useState} from 'react';
import './MainPage.css';
import placeholderImage from '../../assets/images/동해선.png'; // 업로드한 이미지
import donghaeLineImage from '../../assets/images/Donghae_Line.png';
import oceanImage from '../../assets/images/ocean.png'; // 이미지 가져오기
import StationStatsChart from '../../Chart/StationStatsChart';
import DonghaeMap from "../../Donghae/DonghaeMap";
import axios from "axios";
const MainPage = () => {
    const [stationsData, setStationsData] = useState([]);

    // 동해선 역 데이터를 API에서 가져오는 로직
    useEffect(() => {
        // 상태 업데이트가 무한 루프에 빠지지 않도록 의존성 배열 추가
        axios.get("/api/donghae/donghae-line")
            .then(response => {
                const filteredStations = response.data.filter(station => station.lineName === "동해선");
                setStationsData(filteredStations);
            })
            .catch(error => {
                console.error("Error fetching station data:", error);
            });
    }, []);  // 빈 배열 []로 설정하여 최초 렌더링 시 한 번만 실행

    return (
        <div className="main-container">
            {/* 상단 메인 섹션 */}
            <div className="top-section" style={{ backgroundImage: `url(${oceanImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="text-section">
                    <img src={donghaeLineImage} alt="Donghae Line" style={{width: '100px', height: '100px',marginBottom:'2rem'}}/>
                    <h3 style={{marginBottom:'1rem'}}>부산 대표 광역 전철 '동해선'</h3>
                    <h1>동해선 주위의 모든 여행지에 대한</h1>
                    <h1>계획을 세우세요!</h1>
                    <p>부산부터 울산까지 코레일의 광역 전철 ‘동해선’ 주위의 모든 관광지, 먹거리, 축제/행사 등의 정보를 이곳 “Donghae.zip”에서 제공합니다.</p>
                    <div className="search-bar">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="여행지를 검색하세요..."
                                   aria-label="Search"/>
                            <button className="btn btn-primary" type="button">검색</button>
                        </div>
                    </div>
                </div>
                <div className="image-section">
                    <div className="placeholder-image">
                        <img src={placeholderImage} alt="Placeholder" />
                    </div>
                </div>
            </div>

            {/* 하단 추가 섹션 */}
            <div className="bottom-section">
                <div className="half-section left-section">
                    <p style={{fontSize:'2.2rem',marginBottom:'14.1rem'}}>동해선 역을 클릭해 보세요!</p>
                    <div className="map-placeholder" style={{marginTop:'9rem'}}>
                        <DonghaeMap
                            stations={stationsData}
                            accommodations={[]}
                            restaurants={[]}
                            touristSpots={[]}
                            onStationClick={(name) => console.log(`${name} 역 클릭됨`)} />
                    </div>
                </div>
                <div className="half-section right-section">
                    <p style={{fontSize:'2.2rem',marginBottom:'3rem'}}>동해선 시간대 별 승하차자 수 정보</p>
                    <div className="chart-placeholder">
                        <StationStatsChart />
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
