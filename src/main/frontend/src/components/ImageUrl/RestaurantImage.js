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
                style={{ maxWidth: '800px',width:'80rem', height: 'auto', margin: '10px auto', display: 'block' }}  // 크기 조절
            />
        );
    }

    return (
        <div style={{width: '100%', maxWidth: '80rem'}}>
            <Carousel activeIndex={index} onSelect={handleSelect} className="restaurant-carousel" style={{overflow: 'hidden', borderRadius: '20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'}}>
                {imageUrls.map((url, idx) => (
                    <Carousel.Item key={idx} style={{
                        borderRadius: '20px',  /* Carousel.Item에도 border-radius를 명확히 적용 */
                        overflow: 'hidden'   /* overflow를 명확하게 설정 */
                    }}>
                        <img
                            className="d-block w-100 rounded-image"
                            src={url}
                            alt={`레스토랑 이미지 ${idx + 1}`}
                            style={{ maxWidth: '100%', width:'80rem',height: '50rem', margin: '0 auto',objectFit: 'cover',
                                borderRadius: '20px' }}  // 크기 조절
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default RestaurantImage;