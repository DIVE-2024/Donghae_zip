import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewCount = ({ entityType, id, className}) => {
    const [reviewCount, setReviewCount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // id가 유효한 경우에만 API 호출
        const numericId = id ? parseInt(id, 10) : null;

        if (!numericId) {
            setError('유효한 ID가 없습니다.');
            return;
        }

        // 리뷰 개수를 가져오는 API 호출
        axios.get(`/api/comments/${entityType}/${id}/review-count`)
            .then(response => {
                console.log(response);
                setReviewCount(response.data);
            })
            .catch(error => {
                console.error('Error fetching review count:', error);
                setError('리뷰 개수를 불러오지 못했습니다.');
            });
    }, [entityType, id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className={className}>
            <div style={{fontSize: '1.5rem'}}>리뷰 개수: {reviewCount !== null ? reviewCount : '로딩 중...'}</div>
        </div>
    );
};

export default ReviewCount;
