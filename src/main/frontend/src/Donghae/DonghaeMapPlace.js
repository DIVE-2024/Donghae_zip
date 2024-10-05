import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DonghaeMap from './DonghaeMap';
import './MapList.css';
import {Link} from "react-router-dom";  // CSS 파일 임포트

const DonghaeMapPlace = () => {
    const [stations, setStations] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null); // 선택된 숙박시설
    const [showCategory, setShowCategory] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [showAccommodations, setShowAccommodations] = useState(false);
    const [totalAccommodationCount, setTotalAccommodationCount] = useState(0);

    useEffect(() => {
        axios.get("/api/donghae/donghae-line")
            .then((response) => {
                const filteredStations = response.data.filter(station => station.lineName === "동해선");
                setStations(filteredStations);
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    }, []);

    const handleStationClick = (stationName) => {
        axios.get(`/api/donghae/station/${stationName}`)
            .then((response) => {
                const { stationInfo } = response.data;
                setSelectedStation({
                    name: stationInfo.stationName,
                    latitude: stationInfo.latitude,
                    longitude: stationInfo.longitude
                });
                setShowCategory(true);
                setAccommodations([]);
                setShowAccommodations(false);
                setSelectedAccommodation(null);  // 숙박시설 선택 초기화
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    };

    const handleAccommodationClick = (page = 0) => {
        if (selectedStation) {
            const { latitude, longitude } = selectedStation;
            const radius = 2000;

            axios.get(`/api/accommodations/radius`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius,
                    page: page,
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
                .then((response) => {
                    // 숙박시설 데이터 확인용 콘솔로그
                    console.log("숙박 시설 데이터:", response.data.content);

                    setAccommodations(response.data.content);
                    setCurrentPage(page);
                    setShowAccommodations(true);
                    setTotalAccommodationCount(response.data.totalElements); // 전체 숙박시설 개수 저장
                })
                .catch((error) => {
                    console.error("Error fetching accommodation data:", error);
                });
        }
    };


    const handleAccommodationSelect = (accommodation) => {
        setSelectedAccommodation(accommodation); // 선택된 숙박시설 저장
    };

    return (
        <div>
            <h1>동해선 Map</h1>
            <div style={{ display: 'flex' }}>
                <DonghaeMap
                    stations={stations}
                    accommodations={showAccommodations ? accommodations : []}
                    onStationClick={handleStationClick}
                    selectedAccommodation={selectedAccommodation}  // 선택된 숙박시설 전달
                />

                {selectedStation && showCategory && (
                    <div>
                        <h2>{selectedStation.name} 근처 카테고리 선택</h2>
                        <button onClick={() => handleAccommodationClick(0)}>숙박/휴양</button>
                    </div>
                )}

                {accommodations.length > 0 && (
                    <div style={{width:'40rem'}}>
                        <h2>근처 숙박시설 (2km 반경) - 총 {totalAccommodationCount}개</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            {accommodations.map((accommodation, index) => (
                                <div className="card" key={index} onClick={() => handleAccommodationSelect(accommodation)}>
                                    <img src={accommodation.imageUrl} alt={accommodation.name} />
                                    <div className="card-content">
                                        <h3>{accommodation.name}</h3>
                                        <p>주소: {accommodation.address}</p>
                                        <p>가격: {accommodation.averagePrice} 원</p>
                                        <Link to={`/accommodation/${accommodation.uniqueId}`} className="btn btn-primary">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            {currentPage > 0 && (
                                <button onClick={() => handleAccommodationClick(currentPage - 1)}>이전</button>
                            )}
                            {accommodations.length === pageSize && (
                                <button onClick={() => handleAccommodationClick(currentPage + 1)}>다음</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonghaeMapPlace;
