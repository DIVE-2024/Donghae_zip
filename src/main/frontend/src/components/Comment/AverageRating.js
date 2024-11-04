// components/AverageRating.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AverageRating.css'; // 스타일을 위한 별도 CSS 파일

const AverageRating = ({ entityType, entityId, fontSize = '2rem' }) => {
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await axios.get(`/api/comments/${entityType}/${entityId}/average-rating`);
                setAverageRating(response.data);
            } catch (error) {
                console.error(`Error fetching average rating for ${entityType}:`, error);
                setAverageRating(0);
            }
        };

        fetchAverageRating();
    }, [entityType, entityId]);

    const displayRating = typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0';

    return (
        <div className="average-rating">
            {Array.from({ length: 5 }).map((_, index) => {
                const filledPercentage = Math.min(Math.max((averageRating - index) * 100, 0), 100);
                return (
                    <div key={index} className="star-wrapper" style={{ fontSize }}>
                        <i className="bi bi-star-fill empty-star"></i>
                        <i
                            className="bi bi-star-fill filled-star"
                            style={{ width: `${filledPercentage}%` }}
                        ></i>
                    </div>
                );
            })}
            <span style={{ fontSize: '1.5rem', color: '#555', marginLeft: '10px',marginTop:'0.3rem' }}>
                ({displayRating})
            </span>
        </div>
    );
};

export default AverageRating;