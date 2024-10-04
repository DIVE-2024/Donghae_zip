// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DonghaeMap from './DonghaeMap'; // DonghaeMap 컴포넌트 임포트
//
// const DonghaeInfo = () => {
//     const [stations, setStations] = useState([]);
//     const [selectedStation, setSelectedStation] = useState(null); // 선택된 역 정보
//
//     useEffect(() => {
//         // 백엔드에서 동해선 노선에 속한 모든 역 정보 가져오기
//         axios.get("/api/donghae/donghae-line")
//             .then((response) => {
//                 // 동해선 노선에 속한 역들만 필터링하여 상태에 저장
//                 const filteredStations = response.data.filter(station => station.lineName === "동해선");
//                 console.log(filteredStations);
//                 setStations(filteredStations); // 동해선에 속한 역 정보를 상태에 저장
//             })
//             .catch((error) => {
//                 console.error("Error fetching station data:", error);
//             });
//     }, []);
//
//     // 특정 역 정보 가져오기
//     const handleStationClick = (stationName) => {
//         axios.get(`/api/donghae/${stationName}`)
//             .then((response) => {
//                 setSelectedStation(response.data); // 선택한 역 정보를 상태에 저장
//             })
//             .catch((error) => {
//                 console.error("Error fetching station data:", error);
//             });
//     };
//
//     return (
//         <div>
//             <h1>동해선 역 정보</h1>
//
//             {/* DonghaeMap 컴포넌트에 stations 데이터와 클릭 핸들러 전달 */}
//             <DonghaeMap stations={stations} onStationClick={handleStationClick} />
//
//             {/* 선택된 역 정보가 있을 경우 표시 */}
//             {selectedStation && (
//                 <div>
//                     <h2>{selectedStation.stationName} 역 정보</h2>
//                     <img src={selectedStation.stationImageUrl} alt={`${selectedStation.stationName} 이미지`} width="300px" />
//                     <p><strong>노선:</strong> {selectedStation.lineName}</p>
//                     <p><strong>환승 호선:</strong> {selectedStation.transferAvailable}</p>
//                     {selectedStation.transferLine && (
//                         <p><strong>환승 노선:</strong> {selectedStation.transferLine}</p>
//                     )}
//                     <p><strong>운영자:</strong> {selectedStation.railwayOperator}</p>
//                     <p><strong>개찰구안 화장실 유무:</strong> {selectedStation.toiletAvailability}</p>
//                     <p><strong>주소:</strong> {selectedStation.address}</p>
//                     <p><strong>2023년 승차 인원:</strong> {selectedStation.boarding2023}명</p>
//                     <p><strong>2023년 하차 인원:</strong> {selectedStation.alighting2023}명</p>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default DonghaeInfo;
