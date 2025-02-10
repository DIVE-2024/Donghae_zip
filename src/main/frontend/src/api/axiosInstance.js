import axios from 'axios';

// 기본 API URL 설정 (환경 변수 기반)
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// ✅ JWT 없이 요청 가능한 API 리스트
const PUBLIC_PATHS = [
    "/api/weather", // 날씨 정보
    "/api/station-stats", //역 정보
    "/api/accommodations", //숙박 정보
    "/api/trails", //둘렛길 정보
    "/api/restaurants", //식당 정보
    "/api/donghae", // 동해역 정보
    "/api/tourist-spots", //여행지 정보
    "/api/festivals", //축제 정보
    "/api/comments/average-rating", // ✅ 평균 평점 조회
    "/api/comments/review-count",   // ✅ 리뷰 개수 조회
    "/api/comments/reviews"         // ✅ 리뷰 목록 조회
];

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터: JWT 없이 요청할 API인지 확인
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');

        // ✅ JWT 없이 요청해야 하는 경우
        const isPublicApi = PUBLIC_PATHS.some(path => config.url.includes(path));

        if (token && !isPublicApi) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


export default axiosInstance;
