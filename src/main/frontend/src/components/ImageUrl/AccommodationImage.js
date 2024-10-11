import React from 'react';

const AccommodationImage = ({ imageUrls }) => {
    // 이미지 URL이 배열이 아니거나, 배열이 비었을 경우 기본 이미지 표시
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        return (
            <div className="image-container">
                <img src="/image/default_image.png" alt="기본 숙소 이미지" className="accommodation-image" />
            </div>
        );
    }

    return (
        <div className="image-container">
            {imageUrls.map((url, index) => (
                <img
                    key={index}
                    src={url && url !== '이미지 없음' ? url : '/image/default_image.png'}
                    alt={`숙소 ${index + 1}`}
                    className="accommodation-image"
                />
            ))}
        </div>
    );
};


export default AccommodationImage;
