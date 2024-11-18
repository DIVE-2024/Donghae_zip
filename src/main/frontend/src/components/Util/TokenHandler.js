import { useEffect } from "react";
import {parseJwt} from "./jwtUtils";

const TokenHandler = () => {
    useEffect(() => {
        const handleTokenInUrl = () => {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get('token');

            if (token) {
                // 토큰을 다시 sessionStorage에 저장
                sessionStorage.setItem('token', token);

                // URL에서 토큰 제거
                const url = new URL(window.location.href);
                url.searchParams.delete('token');
                window.history.replaceState({}, document.title, url.toString());

                console.log("Token processed and removed from URL:", token);

                // JWT 디코딩 (선택 사항)
                const decodedToken = parseJwt(token);
                console.log("Decoded JWT:", decodedToken);
            }
        };

        handleTokenInUrl();
    }, []);

    return null; // UI 요소를 렌더링하지 않음
};

export default TokenHandler;
