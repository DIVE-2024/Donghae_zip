import axios from 'axios';
import qs from 'qs';  // URL 인코딩을 위한 라이브러리

const BASE_URL = 'http://localhost:8080';  // 백엔드 서버 기본 주소

// 회원가입 함수
export const signUp = async (signUpData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/members/register`, signUpData);
        return response.data;
    } catch (error) {
        console.error("회원가입 실패", error);
        throw error;
    }
};

// 로그인 함수 (URL 인코딩 형식으로 전송)
export const login = async (loginData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/members/login`, qs.stringify(loginData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('로그인 응답 전체:', response);  // 전체 응답을 콘솔에 출력
        console.log('로그인 응답 데이터:', response.data);  // 응답 데이터만 출력

        const { token, nickname, member } = response.data;
        sessionStorage.setItem('token', token);  // 토큰 저장
        return { nickname, member, token };
    } catch (error) {
        console.error("로그인 실패", error);
        throw error;
    }
};

// 로그아웃 함수
export const logout = () => {
    // sessionStorage에서 토큰 삭제
    sessionStorage.removeItem('token');
    console.log("로그아웃 완료");
};

// 소셜 로그인 리다이렉트 함수
export const redirectToSocialLogin = (provider) => {
    // provider 값에 따라 리디렉트 URL을 설정
    const redirectUrls = {
        google: `${BASE_URL}/oauth2/authorization/google`,
        kakao: `${BASE_URL}/oauth2/authorization/kakao`,
        naver: `${BASE_URL}/oauth2/authorization/naver`,
    };

    window.location.href = redirectUrls[provider];
};

// 로그인 상태 확인 함수
export const isLoggedIn = () => {
    // sessionStorage에 토큰이 존재하는지 확인
    const token = sessionStorage.getItem('token');
    return !!token;  // 토큰이 있으면 true 반환, 없으면 false 반환
};