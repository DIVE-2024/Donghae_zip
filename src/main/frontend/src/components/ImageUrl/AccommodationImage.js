import React from 'react';

const AccommodationImage = ({ imageUrls }) => {
    if (!Array.isArray(imageUrls)) {
        return (
            <div className="image-container">
                <img src={imageUrls} alt="숙소 이미지" className="accommodation-image" />
            </div>
        );
    }

    return (
        <div className="image-container">
            {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`숙소 ${index + 1}`} className="accommodation-image" />
            ))}
        </div>
    );
};

export default AccommodationImage;

