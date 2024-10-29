import React, { useEffect, useRef, useState } from 'react';

const DonghaeMap = ({ stations = [], accommodations = [], restaurants = [], touristSpots = [], onStationClick, radius, selectedStation ,hideMap}) => {
    const mapRef = useRef(null); // 지도 객체 참조
    const markersRef = useRef([]); // 생성된 마커 배열 관리
    const circleRef = useRef(null); // Circle 객체를 참조
    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태 관리
    const [activeOverlay, setActiveOverlay] = useState(null); // 현재 활성화된 오버레이 상태 관리
    const [polylines, setPolylines] = useState([]); // 생성된 경로 폴리라인 배열 관리
    const apiKey = process.env.REACT_APP_KAKAO_API_KEY;

    useEffect(() => {
        const loadKakaoMapScript = () => {
            if (!window.kakao || !window.kakao.maps) { // 이미 스크립트가 로드된 경우 중복 로드 방지
                const script = document.createElement('script');
                script.async = true;
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}`;
                document.head.appendChild(script);

                script.onload = () => {
                    if (window.kakao && window.kakao.maps) {
                        setIsMapLoaded(true); // 스크립트 로드 후 상태 변경
                    } else {
                        console.error("Kakao API가 로드되지 않았습니다.");
                    }
                };
            } else {
                setIsMapLoaded(true); // 스크립트가 이미 로드된 경우
            }
        };

        const initializeMap = () => {
            const container = document.getElementById('donghae-map');
            const options = {
                center: new window.kakao.maps.LatLng(35.32803, 129.276652),
                level: 9, // 초기 줌 레벨
            };
            const map = new window.kakao.maps.Map(container, options);
            mapRef.current = map;

            const zoomControl = new window.kakao.maps.ZoomControl();
            map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT); // 오른쪽에 줌 컨트롤 추가

            const mapTypeControl = new window.kakao.maps.MapTypeControl();
            map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT); // 오른쪽 상단에 지도 유형 컨트롤 추가
        };

        if (!isMapLoaded) {
            loadKakaoMapScript(); // isMapLoaded가 false일 때만 스크립트 로드
        } else {
            initializeMap(); // 스크립트 로드 후 지도 초기화
        }
    }, [apiKey, isMapLoaded]); // apiKey와 isMapLoaded에 의존

    // 반경이 변경될 때마다 원을 그리는 함수
    const drawCircle = (station, radius) => {
        if (!station || !radius) {
            console.error("역 정보 또는 반경 값이 올바르지 않습니다.");
            return;
        }

        // 기존 원 제거
        if (circleRef.current) {
            circleRef.current.setMap(null);
        }

        const circleOptions = {
            center: new window.kakao.maps.LatLng(station.latitude, station.longitude),
            radius: radius,  // 반경 값 적용
            strokeWeight: 2,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            strokeStyle: 'solid',
            fillColor: '#00a9ff',
            fillOpacity: 0.3,
        };

        const circle = new window.kakao.maps.Circle(circleOptions);
        circle.setMap(mapRef.current);  // 새로 원 그리기
        circleRef.current = circle;  // 원 객체 저장
    };

    // selectedStation과 radius가 업데이트될 때마다 지도에 반경을 그림
    useEffect(() => {
        if (isMapLoaded && selectedStation && radius) {
            console.log("selectedStation:", selectedStation);
            console.log("radius:", radius);
            mapRef.current.setCenter(new window.kakao.maps.LatLng(selectedStation.latitude, selectedStation.longitude)); // 역 중심으로 이동
            mapRef.current.setLevel(6); // 줌 레벨 설정
            drawCircle(selectedStation, radius); // 선택된 역과 반경이 있을 때만 원을 그림
        }
    }, [isMapLoaded, selectedStation, radius]);

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

    // 마커 및 폴리라인 생성 및 제거 로직
    useEffect(() => {
        if (isMapLoaded && mapRef.current) {
            const createMarker = (latitude, longitude, name, onClick, markerType = 'station') => {
                const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                let markerImageSrc = '';

                switch (markerType) {
                    case 'station':
                        markerImageSrc = '/image/marker.png';
                        break;
                    case 'accommodation':
                        markerImageSrc = '/image/AccommodaionMarker.png';
                        break;
                    case 'restaurant':
                        markerImageSrc = '/image/RestaurantMarker.png';
                        break;
                    case 'touristSpot':
                        markerImageSrc = '/image/TouristSpotMarker.png';
                        break;
                    default:
                        break;
                }

                const imageSize = new window.kakao.maps.Size(40, 40);
                const imageOption = { offset: new window.kakao.maps.Point(20, 40) };
                const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    title: name,
                    image: markerImage,
                });
                marker.setMap(mapRef.current);
                markersRef.current.push(marker);

                const customOverlay = new window.kakao.maps.CustomOverlay({
                    position: markerPosition,
                    content: `<div style="padding: 5px; background-color: white; border-radius: 10px;">${name}</div>`,
                    yAnchor: 2.5,
                    xAnchor: 0.5,
                    zIndex: 3,
                });
                customOverlay.setMap(mapRef.current);
                customOverlay.setVisible(false);

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    onClick(name);
                    mapRef.current.setCenter(markerPosition);
                    mapRef.current.setLevel(6); // 줌 레벨 설정

                    if (activeOverlay) {
                        activeOverlay.setVisible(false);
                    }
                    customOverlay.setVisible(true);
                    setActiveOverlay(customOverlay);
                });

                window.kakao.maps.event.addListener(marker, 'mouseover', () => customOverlay.setVisible(true));
                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                    if (customOverlay !== activeOverlay) {
                        customOverlay.setVisible(false);
                    }
                });
            };

            const createPolyline = (stations) => {
                const path = stations.map(station => new window.kakao.maps.LatLng(station.latitude, station.longitude));
                const polyline = new window.kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 7,
                    strokeColor: "#0074FF",
                    strokeOpacity: 0.8,
                    strokeStyle: "solid",
                });
                polyline.setMap(mapRef.current);
                setPolylines(prev => [...prev, polyline]);
            };

            if (stations.length || accommodations.length || restaurants.length || touristSpots.length) {
                clearMarkers();
                clearPolylines();
            }

            const filteredStations = stations.filter(station => station.region.includes('부산') || station.region.includes('울산'))
                .sort((a, b) => a.stationOrder - b.stationOrder);

            filteredStations.forEach(station => {
                createMarker(station.latitude, station.longitude, station.stationName, onStationClick, 'station');
            });
            createPolyline(filteredStations);

            accommodations.forEach(accommodation => {
                createMarker(accommodation.latitude, accommodation.longitude, accommodation.name, () => {
                    console.log(`숙박시설: ${accommodation.name} 클릭됨`);
                }, 'accommodation');
            });

            restaurants.forEach(restaurant => {
                createMarker(restaurant.latitude, restaurant.longitude, restaurant.name, () => {
                    console.log(`식당: ${restaurant.name} 클릭됨`);
                }, 'restaurant');
            });

            touristSpots.forEach(touristSpot => {
                createMarker(touristSpot.latitude, touristSpot.longitude, touristSpot.title, () => {
                    console.log(`여행지: ${touristSpot.title} 클릭됨`);
                }, 'touristSpot');
            });
        }
    }, [isMapLoaded, stations, accommodations, restaurants, touristSpots, onStationClick, activeOverlay]);

    return (
        <div id="donghae-map"
             style={{
                 width: '48%',
                 height: '60rem',
                 borderRadius: '20px',
                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                 overflow: 'hidden',
                 display: hideMap ? 'none' : 'block',  // hideMap이 true이면 지도 숨김
             }}
        ></div>
    );
};

export default DonghaeMap;
