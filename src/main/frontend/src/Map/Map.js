import React, { useEffect } from 'react';

const loadKakaoMapScript = (apiKey, callback) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}`;
    console.log(script.src);
    document.head.appendChild(script);

    script.onload = () => {
        console.log("Kakao API Loaded:", window.kakao); // Kakao API 로드 확인
        if (window.kakao && window.kakao.maps) {
            callback(); // 스크립트 로드 후 콜백 실행
        } else {
            console.error("Kakao API가 로드되지 않았습니다.");
        }
    };
};


const createMarker = (map, latitude, longitude) => {
    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
    const marker = new window.kakao.maps.Marker({
        position: markerPosition,
    });
    marker.setMap(map);
};

const Map = ({ latitude, longitude, markers = [] }) => {
    useEffect(() => {
        const apiKey = process.env.REACT_APP_KAKAO_API_KEY;

        loadKakaoMapScript(apiKey, () => {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 5,
            };
            const map = new window.kakao.maps.Map(container, options);
            console.log('지도 객체:', map);

            // 기본 마커 생성
            createMarker(map, latitude, longitude);
            console.log('기본 마커 생성:', latitude, longitude);

            // 추가 마커 생성 (있을 경우)
            markers.forEach(({ lat, lng }) => {
                createMarker(map, lat, lng);
                console.log('추가 마커 생성:', lat, lng);
            });
        });
    }, [latitude, longitude, markers]);



    return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

export default Map;
