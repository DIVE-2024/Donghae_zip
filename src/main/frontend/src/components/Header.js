import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
                <Link className="navbar-brand custom-logo" to="/">Donghae.zip</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/station-info">역내 정보</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="/travel-info">여행 정보</a>
                            <ul className="dropdown-menu" aria-labelledby="travelDropdown">
                                <li><Link className="dropdown-item" to="/travelspots">동해선 여행지.zip</Link></li>
                                <li><Link className="dropdown-item" to="/restaurants">동해선 맛집.zip</Link></li>
                                <li><Link className="dropdown-item" to="/festivals">동해선 축제.zip</Link></li>
                                <li><Link className="dropdown-item" to="/accommodations">동해선 숙소.zip</Link></li>
                                <li><Link className="dropdown-item" to="/trails">동해선 둘레길.zip</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/departures">동해 출동해</Link>
                        </li>
                        <li className="nav-item dropdown mypage">
                            <Link className="nav-link" to="/mypage">MyPage</Link>
                            <ul className="dropdown-menu" aria-labelledby="mypageDropdown">
                                <li><Link className="dropdown-item" to="/wishlist">찜 목록</Link></li>
                                <li><Link className="dropdown-item" to="/myreviews">내가 쓴 리뷰</Link></li>
                            </ul>
                        </li>
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">회원가입</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-primary custom-login-btn" onClick={handleLoginClick}>Log In</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-primary custom-login-btn" onClick={handleLogoutClick}>Log Out</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;