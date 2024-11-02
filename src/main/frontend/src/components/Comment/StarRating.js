// components/StarRating.js
import React from 'react';

const StarRating = ({ rating }) => (
    <div className="star-rating">
        {[...Array(5)].map((_, index) => (
            <i
                key={index}
                className={`bi ${index < rating ? 'bi-star-fill text-warning' : 'bi-star'}`}
                style={{ fontSize: '1.8rem' }}
            ></i>
        ))}
    </div>
);

export default StarRating;
