import React from 'react';

const RestaurantImage = ({ imageUrls }) => {
    if (!Array.isArray(imageUrls)) {
        return <img src={imageUrls} alt="레스토랑 이미지" style={{ width: '100px', height: '100px', margin: '10px' }} />;
    }

    return (
        <div>
            {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`레스토랑 ${index + 1}`} style={{ width: '100px', height: '100px', margin: '10px' }} />
            ))}
        </div>
    );
};

export default RestaurantImage;
