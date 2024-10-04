import React from 'react';
import './MainPage.css';
import placeholderImage from '../../assets/images/동해선.png'; // 업로드한 이미지

const MainPage = () => {
    return (
        <div className="main-container">
            {/* 상단 메인 섹션 */}
            <div className="top-section">
                <div className="text-section">
                    <h5>부산 대표 광역 전철 '동해선'</h5>
                    <h1>동해선 주위의 모든 여행지에 대한</h1>
                    <h1>계획을 세우세요!</h1>
                    <p>부산부터 울산까지 코레일의 광역 전철 ‘동해선’ 주위의 모든 관광지, 먹거리, 축제/행사 등의 정보를 이곳 “Donghae.zip”에서 제공합니다.</p>
                    <div className="search-bar">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="여행지를 검색하세요..." aria-label="Search" />
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
                    <h3>동해선 역을 클릭해 보세요!</h3>
                    <div className="map-placeholder">
                        <img src="" alt="Map Placeholder" />
                    </div>
                </div>
                <div className="half-section right-section">
                    <h3>동해선 시간대 별 승하차자 수 정보</h3>
                    <div className="chart-placeholder">
                        <img src="" alt="Chart Placeholder" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
