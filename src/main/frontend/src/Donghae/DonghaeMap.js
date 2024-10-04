import React, { useEffect, useRef, useState } from 'react';

const DonghaeMap = ({ stations = [], accommodations = [], onStationClick, selectedAccommodation }) => {
    const mapRef = useRef(null); // 지도 객체 참조
    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태 관리
    const apiKey = process.env.REACT_APP_KAKAO_API_KEY;

    useEffect(() => {
        const loadKakaoMapScript = (apiKey, callback) => {
            const script = document.createElement('script');
            script.async = true;
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}`;
            document.head.appendChild(script);

            script.onload = () => {
                if (window.kakao && window.kakao.maps) {
                    setIsMapLoaded(true); // 스크립트 로드 후 상태 변경
                    callback(); // 콜백 실행
                } else {
                    console.error("Kakao API가 로드되지 않았습니다.");
                }
            };
        };

        const initializeMap = () => {
            const container = document.getElementById('donghae-map');
            const options = {
                center: new window.kakao.maps.LatLng(35.32803, 129.276652),
                level: 9,
            };
            const map = new window.kakao.maps.Map(container, options);
            mapRef.current = map;
        };

        loadKakaoMapScript(apiKey, initializeMap);
    }, [apiKey]);

    useEffect(() => {
        if (isMapLoaded && mapRef.current) {
            const createMarker = (latitude, longitude, name, onClick, markerType = 'station') => {
                const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

                // 마커 이미지 설정
                let markerImageSrc = '';
                if (markerType === 'station') {
                    markerImageSrc = '/image/marker.png'; // 역 마커 이미지 경로
                } else if (markerType === 'accommodation') {
                    markerImageSrc = '/image/AccommodaionMarker.png'; // 숙박시설 마커 이미지 경로
                }

                const imageSize = new window.kakao.maps.Size(40, 40); // 마커 크기
                const imageOption = { offset: new window.kakao.maps.Point(20, 40) }; // 마커 이미지의 앵커 포인트 설정

                const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

                // 마커 생성
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    title: name,
                    image: markerImage // 커스텀 마커 이미지 적용
                });
                marker.setMap(mapRef.current);

                // 마커 클릭 이벤트
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    onClick(name);
                    mapRef.current.setCenter(markerPosition);
                    mapRef.current.setLevel(5);
                });

                // 커스텀 오버레이 (라벨) 생성
                const labelContent = `
                <div style="
                    padding: 5px;
                    background-color: white;
                    border: 1px solid black;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    min-width: 100px;
                    cursor: pointer;">
                    ${name}
                </div>`;

                const customOverlay = new window.kakao.maps.CustomOverlay({
                    position: markerPosition,
                    content: labelContent,
                    yAnchor: 2.5, // 마커 위에 이름 표시
                    xAnchor: 0.5,
                    zIndex: 3,
                });
                customOverlay.setMap(mapRef.current);
                customOverlay.setVisible(false); // 기본적으로 숨김

                // 마커에 마우스 오버 시 이름 보이기
                window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                    customOverlay.setVisible(true); // 마우스 오버 시 라벨 표시
                });

                // 마커에서 마우스 아웃 시 이름 숨기기
                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                    customOverlay.setVisible(false); // 마우스 아웃 시 라벨 숨김
                });
            };

            const createPolyline = (stations) => {
                const path = stations.map(station =>
                    new window.kakao.maps.LatLng(station.latitude, station.longitude)
                );

                const polyline = new window.kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 7,
                    strokeColor: "#0074FF",
                    strokeOpacity: 0.8,
                    strokeStyle: "solid",
                });
                polyline.setMap(mapRef.current);
            };

            // 지도에 역 마커와 폴리라인 추가
            const filteredStations = stations
                .filter(station => station.region.includes('부산') || station.region.includes('울산'))
                .sort((a, b) => a.stationOrder - b.stationOrder);

            filteredStations.forEach((station) => {
                createMarker(station.latitude, station.longitude, station.stationName, onStationClick, 'station');
            });

            createPolyline(filteredStations);

            // 숙박시설 마커 생성
            accommodations.forEach((accommodation) => {
                createMarker(accommodation.latitude, accommodation.longitude, accommodation.name, () => {
                    console.log(`숙박시설: ${accommodation.name} 클릭됨`);
                }, 'accommodation');
            });
        }
    }, [isMapLoaded, stations, accommodations, onStationClick]);

    return <div id="donghae-map" style={{ width: '50%', height: '1000px' }}></div>;
};

export default DonghaeMap;
