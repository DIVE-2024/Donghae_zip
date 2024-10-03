import React from 'react';

const AccommodationImage = ({ imageUrls }) => {
    if (!Array.isArray(imageUrls)) {
        return <img src={imageUrls} alt="숙소 이미지" style={{ width: '100px', height: '100px', margin: '10px' }} />;
    }

    return (
        <div>
            {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`숙소 ${index + 1}`} style={{ width: '100px', height: '100px', margin: '10px' }} />
            ))}
        </div>
    );
};

export default AccommodationImage;
