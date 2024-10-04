import React, { useEffect } from 'react';

const DonghaeMap = ({ stations = [], onStationClick }) => {
    useEffect(() => {
        const apiKey = process.env.REACT_APP_KAKAO_API_KEY; // 카카오 API 키

        const loadKakaoMapScript = (apiKey, callback) => {
            const script = document.createElement('script');
            script.async = true;
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}`;
            document.head.appendChild(script);

            script.onload = () => {
                if (window.kakao && window.kakao.maps) {
                    callback(); // 스크립트 로드 후 콜백 실행
                } else {
                    console.error("Kakao API가 로드되지 않았습니다.");
                }
            };
        };

        const createMarker = (map, latitude, longitude, stationName, onClick, index) => {
            console.log(`마커 생성 - ${stationName}: (${latitude}, ${longitude})`);

            // 마커 위치 설정
            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                title: stationName,
            });

            // 마커를 지도에 표시
            marker.setMap(map);

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, 'click', () => {
                onClick(stationName);
            });

            // 각 역의 인덱스에 따라 라벨 위치를 다르게 설정
            const labelOffsetY = index % 2 === 0 ? -40 : 40; // 짝수 인덱스는 위쪽, 홀수 인덱스는 아래쪽에 표시

            // CustomOverlay로 역 이름을 표시
            const labelContent = `
                <div style="
                    padding: 5px;
                    background-color: white;
                    border: 1px solid black;
                    border-radius: 10px;
                    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    min-width: 100px;
                    cursor: pointer;">
                    ${stationName}
                </div>`;

            const customOverlay = new window.kakao.maps.CustomOverlay({
                position: markerPosition,
                content: labelContent,
                yAnchor: labelOffsetY / 100, // yAnchor를 조정하여 라벨 위치 조정
                xAnchor: 0.5 // xAnchor는 중앙에 위치하게 설정
            });
            customOverlay.setMap(map);

            // 라벨 클릭 이벤트 (역 이름 클릭 시에도 onClick 호출)
            window.kakao.maps.event.addListener(customOverlay, 'click', () => {
                onClick(stationName);
            });
        };

        // 중간 좌표 생성 함수
        const interpolate = (startLat, startLng, endLat, endLng, numPoints) => {
            const points = [];
            for (let i = 1; i < numPoints; i++) {
                const lat = startLat + (endLat - startLat) * (i / numPoints);
                const lng = startLng + (endLng - startLng) * (i / numPoints);
                points.push(new window.kakao.maps.LatLng(lat, lng));
            }
            return points;
        };

        const createPolyline = (map, stations) => {
            const path = [];
            stations.forEach((station, index) => {
                path.push(new window.kakao.maps.LatLng(station.latitude, station.longitude));

                // 각 역 사이에 10개의 중간 좌표를 생성하여 곡선을 만든다
                if (index < stations.length - 1) {
                    const nextStation = stations[index + 1];
                    const interpolatedPoints = interpolate(
                        station.latitude,
                        station.longitude,
                        nextStation.latitude,
                        nextStation.longitude,
                        10 // 중간 좌표 개수
                    );
                    path.push(...interpolatedPoints);
                }
            });

            const polyline = new window.kakao.maps.Polyline({
                path: path, // 생성된 좌표 배열
                strokeWeight: 5, // 선의 두께
                strokeColor: "#0074FF", // 선 색상 (좀 더 명확한 파란색)
                strokeOpacity: 0.8, // 선의 투명도
                strokeStyle: "solid", // 선 스타일
            });
            polyline.setMap(map);
        };

        loadKakaoMapScript(apiKey, () => {
            const container = document.getElementById('donghae-map');
            const options = {
                center: new window.kakao.maps.LatLng(35.32803, 129.276652), // 초기 중심 좌표 (부전역 기준으로 수정 가능)
                level: 9, // 지도 확대 레벨
            };
            const map = new window.kakao.maps.Map(container, options);

            // '부산' 또는 '울산' 지역 필터링 및 역 순서대로 정렬
            const filteredStations = stations
                .filter(station => station.region.includes('부산') || station.region.includes('울산'))
                .sort((a, b) => a.stationOrder - b.stationOrder);

            // 마커 생성 및 라벨 설정
            filteredStations.forEach((station, index) => {
                createMarker(map, station.latitude, station.longitude, station.stationName, onStationClick, index);
            });

            // 정렬된 역들만으로 폴리라인 그리기 (곡선 효과)
            createPolyline(map, filteredStations);
        });
    }, [stations, onStationClick]);

    return <div id="donghae-map" style={{ width: '50%', height: '1000px',margin: '0 auto' }}></div>;
};

export default DonghaeMap;
