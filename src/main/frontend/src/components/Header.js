import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'; // 커스텀 CSS 파일

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const navigate = useNavigate();

    useEffect(() => {
        // 토큰이 있으면 로그인된 상태로 처리
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        logout(); // 로그아웃 함수 호출
        setIsLoggedIn(false); // 로그인 상태를 false로 변경
        navigate('/'); // 로그아웃 후 메인 페이지로 이동
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
            <div className="container-fluid">
                <a className="navbar-brand custom-logo" href="/">Donghae.zip</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/station-info">역내 정보</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="/travel-info">여행 정보</a>
                            <ul className="dropdown-menu" aria-labelledby="travelDropdown">
                                <li><a className="dropdown-item" href="/travel-donghae">동해선 여행지.zip</a></li>
                                <li><a className="dropdown-item" href="/food-donghae">동해선 맛집.zip</a></li>
                                <li><a className="dropdown-item" href="/festival-donghae">동해선 축제.zip</a></li>
                                <li><a className="dropdown-item" href="/accommodation-donghae">동해선 숙소.zip</a></li>
                                <li><a className="dropdown-item" href="/trail-donghae">동해선 둘레길.zip</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/departures">동해 출동해</a>
                        </li>
                        <li className="nav-item dropdown mypage">
                            <a className="nav-link" href="/mypage">MyPage</a>
                            <ul className="dropdown-menu" aria-labelledby="mypageDropdown">
                                <li><a className="dropdown-item" href="/wishlist">찜 목록</a></li>
                                <li><a className="dropdown-item" href="/myreviews">내가 쓴 리뷰</a></li>
                            </ul>
                        </li>
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/signup">회원가입</a>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-primary custom-login-btn" onClick={handleLoginClick}>Log In</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-primary custom-login-btn" onClick={handleLogoutClick}>Log Out</button> {/* 여기서 btn-primary로 변경 */}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;