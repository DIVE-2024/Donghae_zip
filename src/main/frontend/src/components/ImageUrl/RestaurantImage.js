import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RestaurantImage = ({ imageUrls }) => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    if (!Array.isArray(imageUrls)) {
        return (
            <img
                src={imageUrls}
                alt="레스토랑 이미지"
                className="restaurant-image"
                style={{ maxWidth: '600px', height: 'auto', margin: '10px auto', display: 'block' }}  // 크기 조절
            />
        );
    }

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} className="restaurant-carousel">
            {imageUrls.map((url, idx) => (
                <Carousel.Item key={idx}>
                    <img
                        className="d-block w-100 rounded-image"
                        src={url}
                        alt={`레스토랑 이미지 ${idx + 1}`}
                        style={{ maxWidth: '600px', height: 'auto', margin: '0 auto' }}  // 크기 조절
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default RestaurantImage;