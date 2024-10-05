import React, {useEffect, useRef, useState} from 'react';

const DonghaeMap = ({stations = [], accommodations = [], restaurants = [], touristSpots = [], onStationClick}) => {
    const mapRef = useRef(null); // 지도 객체 참조
    const markersRef = useRef([]); // 생성된 마커 배열 관리
    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태 관리
    const [activeOverlay, setActiveOverlay] = useState(null); // 현재 활성화된 오버레이 상태 관리
    const [polylines, setPolylines] = useState([]); // 생성된 경로 폴리라인 배열 관리
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
                level: 9, // 초기 줌 레벨
            };
            const map = new window.kakao.maps.Map(container, options);
            mapRef.current = map;

            // ZoomControl 추가
            const zoomControl = new window.kakao.maps.ZoomControl();
            map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT); // 오른쪽에 줌 컨트롤 추가

            // MapTypeControl 추가 (선택 사항: 위성지도, 일반지도 등)
            const mapTypeControl = new window.kakao.maps.MapTypeControl();
            map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT); // 오른쪽 상단에 지도 유형 컨트롤 추가
        };

        loadKakaoMapScript(apiKey, initializeMap);
    }, [apiKey]);

    const clearMarkers = () => {
        // 모든 마커를 지도에서 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = []; // 마커 배열 초기화
    };

    const clearPolylines = () => {
        // 모든 폴리라인을 지도에서 제거
        polylines.forEach(polyline => polyline.setMap(null));
        setPolylines([]); // 폴리라인 배열 초기화
    };

    const searchRoute = (start, end) => {
        // 출발지와 도착지의 좌표로 경로를 그리는 함수
        const startLatLng = new window.kakao.maps.LatLng(start.latitude, start.longitude);
        const endLatLng = new window.kakao.maps.LatLng(end.latitude, end.longitude);

        // 폴리라인을 그리기 위한 경로 검색 로직 (도보/차량 경로 등 API 연동 가능)
        const polylinePath = [startLatLng, endLatLng]; // 여기서는 단순한 두 지점 간 경로 예시

        const polyline = new window.kakao.maps.Polyline({
            path: polylinePath, // 경로 좌표 배열
            strokeWeight: 5,
            strokeColor: '#FF0000',
            strokeOpacity: 0.7,
            strokeStyle: 'solid',
        });

        polyline.setMap(mapRef.current); // 지도에 폴리라인 표시
        setPolylines(prevPolylines => [...prevPolylines, polyline]); // 생성된 폴리라인을 저장
    };

    useEffect(() => {
        if (isMapLoaded && mapRef.current) {
            // 마커 생성 함수
            const createMarker = (latitude, longitude, name, onClick, markerType = 'station') => {
                const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

                // 마커 이미지 설정
                let markerImageSrc = '';
                if (markerType === 'station') {
                    markerImageSrc = '/image/marker.png'; // 역 마커 이미지 경로
                } else if (markerType === 'accommodation') {
                    markerImageSrc = '/image/AccommodaionMarker.png'; // 숙박시설 마커 이미지 경로
                } else if (markerType === 'restaurant') {
                    markerImageSrc = '/image/RestaurantMarker.png'; // 식당 마커 이미지 경로
                } else if (markerType === 'touristSpot') {
                    markerImageSrc = '/image/TouristSpotMarker.png'; // 여행지 마커 이미지 경로
                }

                const imageSize = new window.kakao.maps.Size(40, 40); // 마커 크기
                const imageOption = {offset: new window.kakao.maps.Point(20, 40)}; // 마커 이미지의 앵커 포인트 설정

                const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

                // 마커 생성
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    title: name,
                    image: markerImage // 커스텀 마커 이미지 적용
                });
                marker.setMap(mapRef.current);

                // 마커 배열에 추가
                markersRef.current.push(marker);

                // 커스텀 오버레이 (라벨) 생성
                const labelContent = `
                <div style="
                    padding: 5px;
                    background-color: white;
                    border: 1px solid black;
                    border-radius: 10px;
                    font-size: 16px;
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

                // 마커 클릭 이벤트
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    onClick(name);
                    mapRef.current.setCenter(markerPosition);
                    mapRef.current.setLevel(5);

                    // 기존 활성 오버레이가 있으면 숨기기
                    if (activeOverlay) {
                        activeOverlay.setVisible(false);
                    }

                    // 새로운 오버레이를 활성화하고 보이도록 설정
                    customOverlay.setVisible(true);
                    setActiveOverlay(customOverlay);
                });

                // 마커에 마우스 오버 시 이름 보이기
                window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                    customOverlay.setVisible(true); // 마우스 오버 시 라벨 표시
                });

                // 마커에서 마우스 아웃 시 이름 숨기기 (클릭된 상태는 유지)
                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                    if (customOverlay !== activeOverlay) {
                        customOverlay.setVisible(false); // 마우스 아웃 시 라벨 숨김
                    }
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

            // 이전 마커 및 폴리라인 제거
            clearMarkers();
            clearPolylines();

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

            // 식당 마커 생성
            restaurants.forEach((restaurant) => {
                createMarker(restaurant.latitude, restaurant.longitude, restaurant.name, () => {
                    console.log(`식당: ${restaurant.name} 클릭됨`);
                }, 'restaurant');
            });

            // 여행지 마커 생성
            touristSpots.forEach((touristSpot) => {
                createMarker(touristSpot.latitude, touristSpot.longitude, touristSpot.title, () => {
                    console.log(`여행지: ${touristSpot.title} 클릭됨`);
                }, 'touristSpot');
            });
        }
    }, [isMapLoaded, stations, accommodations, restaurants, touristSpots, onStationClick, activeOverlay]);

    return (
        <div id="donghae-map"
             style={{
                 width: '100%',
                 height: '60rem',
                 marginBottom: '12rem',
                 borderRadius: '20px', // 둥근 모서리 적용
                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 입체감을 주기 위한 그림자 효과
                 overflow: 'hidden', // 모서리 밖의 요소가 보이지 않게
             }}
        ></div>
    );
};

export default DonghaeMap;