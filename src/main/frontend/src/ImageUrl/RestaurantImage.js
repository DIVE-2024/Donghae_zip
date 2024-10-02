import React from 'react';

const RestaurantImage = ({ imageUrls }) => {
    // imageUrls가 배열인지 확인
    if (!Array.isArray(imageUrls)) {
        // imageUrls가 배열이 아닐 경우 단일 이미지를 처리
        return <img src={imageUrls} alt="Restaurant" style={{ width: '100px', height: '100px', margin: '10px' }} />;
    }

    // imageUrls가 배열일 경우 각 URL을 개별 이미지로 출력
    return (
        <div>
            {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Image ${index + 1}`} style={{ width: '100px', height: '100px', margin: '10px' }} />
            ))}
        </div>
    );
};

export default RestaurantImage;
