// import React, { useEffect } from 'react';
// import subwayMap from '../assets/images/동해선_노선도.png'; // 이미지 경로
//
// const ImageMapWithCoordinates = () => {
//
//     useEffect(() => {
//         const image = document.querySelector('img');
//         if (image) {
//             image.addEventListener('click', function(event) {
//                 const x = event.offsetX; // 이미지 내에서 클릭한 X 좌표
//                 const y = event.offsetY; // 이미지 내에서 클릭한 Y 좌표
//                 console.log('클릭된 좌표: ' + x + ', ' + y);
//             });
//         }
//
//         // 클린업 함수: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
//         return () => {
//             if (image) {
//                 image.removeEventListener('click', () => {});
//             }/**/
//         };
//     }, []);
//
//     return (
//         <div>
//             <h1>동해선 노선도</h1>
//             <img src={subwayMap} alt="동해선 노선도" style={{ width: '50%', height: 'auto' }} />
//         </div>
//     );
// };
//
// export default ImageMapWithCoordinates;
