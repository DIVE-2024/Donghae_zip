import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FavoriteButton.css';
import Warning from "../Warning/Warning";
import axiosInstance from "../../api/axiosInstance";

const FavoriteButton = ({ entityType, entityId, userId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // 엔터티의 초기 찜 상태 확인
        fetchFavoriteStatus();
    }, [entityType, entityId, userId]);

    const fetchFavoriteStatus = async () => {
        if (!userId || !sessionStorage.getItem('token')) return;

        try {
            const response = await axiosInstance.get(`/api/favorites/auth/${entityType}/${entityId}`, {
                params: { email: userId }
            });
            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error('찜 상태 확인 중 오류:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!userId || !sessionStorage.getItem('token')) {
            setShowWarning(true); // Warning 모달을 열기
            return;
        }

        try {
            if (isFavorite) {
                // 찜 해제
                await axiosInstance.delete(`/api/favorites/auth/${entityType}/${entityId}`, {
                    params: { email: userId }
                });
                setIsFavorite(false);
            } else {
                // 찜 추가
                await axiosInstance.post(`/api/favorites/auth/${entityType}/${entityId}`, null, {
                    params: { email: userId }
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error(isFavorite ? "찜 해제 중 오류:" : "찜 추가 중 오류:", error);
            alert(isFavorite ? "찜 해제에 실패했습니다." : "찜 추가에 실패했습니다.");
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
