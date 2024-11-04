import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FavoriteButton.css';
import Warning from "../Warning/Warning";

const FavoriteButton = ({ entityType, entityId, userId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // 엔터티의 초기 찜 상태 확인
        fetchFavoriteStatus();
    }, [entityType, entityId, userId]);

    const fetchFavoriteStatus = () => {
        const token = sessionStorage.getItem('token');
        if (!userId || !token) return;

        axios.get(`/api/favorites/auth/${entityType}/${entityId}?email=${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setIsFavorite(response.data.isFavorite))
            .catch(error => console.error('찜 상태 확인 중 오류:', error));
    };

    const toggleFavorite = () => {
        const token = sessionStorage.getItem('token');
        if (!userId || !token) {
            setShowWarning(true); // Warning 모달을 열기
            return;
        }

        if (isFavorite) {
            // 찜 해제
            axios.delete(`/api/favorites/auth/${entityType}/${entityId}?email=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => setIsFavorite(false))
                .catch(error => {
                    console.error("찜 해제 중 오류:", error);
                    alert("찜 해제에 실패했습니다.");
                });
        } else {
            // 찜 추가
            axios.post(`/api/favorites/auth/${entityType}/${entityId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { email: userId }
            })
                .then(() => setIsFavorite(true))
                .catch(error => {
                    console.error("찜 추가 중 오류:", error);
                    alert("찜 추가에 실패했습니다.");
                });
        }
    };

    const handleConfirmWarning = () => {
        setShowWarning(false);
        // 로그인 페이지로 이동
        window.location.href = '/login';
    };

    return (
        <>
            <i
                className={`bi bi-heart${isFavorite ? '-fill heart-icon-fill' : ''} heart-icon`}
                onClick={toggleFavorite}
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
            ></i>

            <Warning
                show={showWarning}
                message="로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
                onConfirm={handleConfirmWarning}
                onCancel={() => setShowWarning(false)}
            />
        </>
    );
};

export default FavoriteButton;
