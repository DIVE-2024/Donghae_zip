import React, { useEffect, useRef, useState } from 'react';

const DonghaeMap = ({ stations = [], accommodations = [], restaurants = [], touristSpots = [],filteredMarkers = [], onStationClick, selectedCategory, radius, selectedStation ,hideMap}) => {
    const mapRef = useRef(null); // 지도 객체 참조
    const markersRef = useRef([]); // 생성된 마커 배열 관리
    const circleRef = useRef(null); // Circle 객체를 참조
    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태 관리
    const [activeOverlay, setActiveOverlay] = useState(null); // 현재 활성화된 오버레이 상태 관리
    const [polylines, setPolylines] = useState([]); // 생성된 경로 폴리라인 배열 관리
    const apiKey = process.env.REACT_APP_KAKAO_API_KEY;

    // 마커 생성 함수: 모든 useEffect에서 사용 가능
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

    useEffect(() => {
        if (isMapLoaded && selectedStation && radius) {
            console.log("Drawing circle for:", selectedStation);
            mapRef.current.setCenter(new window.kakao.maps.LatLng(selectedStation.latitude, selectedStation.longitude));
            mapRef.current.setLevel(6);
            drawCircle(selectedStation, radius); // 반경 그리기
        }
    }, [isMapLoaded, selectedStation, radius]);


    const clearMarkers = (keepStations = false) => {
        // keepStations가 true이면 역 마커는 유지
        markersRef.current = markersRef.current.filter((marker) => {
            const isStationMarker = marker.getTitle()?.includes('역');
            if (keepStations && isStationMarker) {
                return true; // 역 마커는 제거하지 않음
            } else {
                marker.setMap(null); // 지도에서 제거
                return false; // 역 마커가 아니므로 삭제
            }
        });
    };


    const clearPolylines = () => {
        // 모든 폴리라인을 지도에서 제거
        polylines.forEach(polyline => polyline.setMap(null));
        setPolylines([]); // 폴리라인 배열 초기화
    };

    useEffect(() => {
        if (!isMapLoaded || !mapRef.current) return;

        // 마커 및 폴리라인 초기화
        clearMarkers();
        clearPolylines();

        // 역 마커 생성 (항상 유지)
        const filteredStations = stations
            .filter((station) => station.region.includes("부산") || station.region.includes("울산"))
            .sort((a, b) => a.stationOrder - b.stationOrder);

        filteredStations.forEach((station) => {
            createMarker(
                station.latitude,
                station.longitude,
                station.stationName,
                (stationName) => onStationClick(stationName),
                "station" // 역 마커 타입
            );
        });

        // 폴리라인 생성
        if (filteredStations.length > 1) {
            const path = filteredStations.map(
                (station) => new window.kakao.maps.LatLng(station.latitude, station.longitude)
            );
            const polyline = new window.kakao.maps.Polyline({
                path: path,
                strokeWeight: 7,
                strokeColor: "#0074FF",
                strokeOpacity: 0.8,
                strokeStyle: "solid",
            });
            polyline.setMap(mapRef.current); // 폴리라인을 지도에 추가
            setPolylines((prev) => [...prev, polyline]);
        }

        // 선택된 카테고리에 따라 마커 생성
        if (selectedCategory === "accommodations") {
            accommodations.forEach((acc) => {
                createMarker(
                    acc.latitude,
                    acc.longitude,
                    acc.name,
                    () => console.log(`숙박: ${acc.name}`),
                    "accommodation"
                );
            });
        } else if (selectedCategory === "restaurants") {
            restaurants.forEach((res) => {
                createMarker(
                    res.latitude,
                    res.longitude,
                    res.name,
                    () => console.log(`식당: ${res.name}`),
                    "restaurant"
                );
            });
        } else if (selectedCategory === "touristSpots") {
            touristSpots.forEach((spot) => {
                createMarker(
                    spot.latitude,
                    spot.longitude,
                    spot.title,
                    () => console.log(`여행지: ${spot.title}`),
                    "touristSpot"
                );
            });
        }
    }, [
        isMapLoaded,
        selectedCategory,
        stations,
        accommodations,
        restaurants,
        touristSpots,
        onStationClick,
    ]);





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
