import React from 'react';
import './Login.css';
import googleLoginImage from './assets/images/GoogleLogin.png';
import kakaoLoginImage from './assets/images/KakaoLogin.png';
import naverLoginImage from './assets/images/NaverLogin.png';

function Login() {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const handleKakaoLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
    };

    const handleNaverLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Login</h2>
                <div className="button-container text-center">
                    <button className="login-button btn" onClick={handleGoogleLogin}>
                        <img src={googleLoginImage} alt="Google Login" className="login-img" />
                    </button>
                    <button className="login-button btn" onClick={handleKakaoLogin}>
                        <img src={kakaoLoginImage} alt="Kakao Login" className="login-img" />
                    </button>
                    <button className="login-button btn" onClick={handleNaverLogin}>
                        <img src={naverLoginImage} alt="Naver Login" className="login-img" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;