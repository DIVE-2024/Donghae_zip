import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DonghaeMap from './DonghaeMap'; // DonghaeMap 컴포넌트 임포트

const DonghaeHotPlace = () => {
    const [stations, setStations] = useState([]);
    const [hotPlaces, setHotPlaces] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null); // 선택된 역 정보

    useEffect(() => {
        // 백엔드에서 동해선 노선에 속한 모든 역 정보 가져오기
        axios.get("/api/donghae/donghae-line")
            .then((response) => {
                // 동해선 노선에 속한 역들만 필터링하여 상태에 저장
                const filteredStations = response.data.filter(station => station.lineName === "동해선");
                setStations(filteredStations); // 동해선에 속한 역 정보를 상태에 저장
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    }, []);

    // 특정 역 근처의 핫플레이스 정보 가져오기
    const handleStationClick = (stationName) => {
        setSelectedStation(stationName); // 클릭한 역 이름을 저장
        axios.get(`/api/hotplaces/${stationName}`)
            .then((response) => {
                setHotPlaces(response.data); // 해당 역 근처의 핫플레이스 정보 저장
            })
            .catch((error) => {
                console.error("Error fetching hot place data:", error);
            });
    };

    return (
        <div>
            <h1>동해선 근처 핫플레이스</h1>

            {/* DonghaeMap 컴포넌트에 역 정보와 클릭 핸들러 전달 */}
            <DonghaeMap stations={stations} onStationClick={handleStationClick} />

            {/* 선택된 역 근처 핫플레이스 정보 표시 */}
            {selectedStation && (
                <div>
                    <h2>{selectedStation} 근처 인기 장소</h2>
                    <ul>
                        {hotPlaces.length > 0 ? (
                            hotPlaces.map((place, index) => (
                                <li key={index}>
                                    <h3>{place.name}</h3>
                                    <p>{place.description}</p>
                                </li>
                            ))
                        ) : (
                            <p>해당 역 근처에 핫플레이스 정보가 없습니다.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DonghaeHotPlace;
