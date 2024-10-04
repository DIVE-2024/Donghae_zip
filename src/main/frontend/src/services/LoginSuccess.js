import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // URL에서 토큰 추출
        const token = new URLSearchParams(window.location.search).get('token');
        if (token) {
            // 토큰을 sessionStorage에 저장
            sessionStorage.setItem('token', token);
            // 로그인된 상태로 메인 페이지로 리다이렉트
            navigate('/');
        }
    }, [navigate]);

    return null;  // 이 페이지는 사용자에게 표시되지 않음
};

export default LoginSuccess;