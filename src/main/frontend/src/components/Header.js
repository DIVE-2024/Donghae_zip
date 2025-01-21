import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'; // 커스텀 CSS 파일
import Logo from '../assets/images/logo.png';
import {parseJwt} from "./Util/jwtUtils";
import Warning from "./Warning/Warning";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [displayName, setDisplayName] = useState(null); // 표시할 이름 상태 추가


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decoded = parseJwt(token);
            console.log("Decoded JWT:", decoded);

            if (decoded) {
                setUserId(decoded.sub); // 이메일 저장
                const provider = decoded.provider || null; // 소셜 로그인 provider 확인
                const name = decoded.name || "이름 없음"; // 이름 확인, 기본값 설정
                const nickname = decoded.nickname || "닉네임 없음"; // 닉네임 확인, 기본값 설정

                // 카카오 로그인인 경우 name 사용, 일반 로그인인 경우 nickname 사용
                if (provider === 'kakao') {
                    setDisplayName(name ? name : "카카오 사용자");
                } else {
                    setDisplayName(nickname ? nickname : "일반 사용자");
                }
            } else {
                console.log("Decoded JWT is invalid");
            }
        } else {
            console.log("Token not found in session storage");
        }

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

    const handleProtectedNavigation = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // Prevent default link action
            setShowWarning(true); // Show warning modal
        }
    };

    const handleConfirmWarning = () => {
        setShowWarning(false);
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand custom-logo" to="/"
                      style={{display: 'flex', alignItems: 'center', fontSize: '4rem'}}>
                    Donghae.zip
                    <img src={Logo} alt="Donghae.zip Logo" style={{width: '6rem', marginLeft: '3px'}}/>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/donghae-subway">역내 정보</Link>
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
                            <Link className="nav-link" to="/donghae-myTravel" onClick={handleProtectedNavigation}>동해
                                출동해</Link>
                        </li>
                        <li className="nav-item dropdown mypage">
                            <Link className="nav-link" to="/mypage" onClick={handleProtectedNavigation}>MyPage</Link>
                            <ul className="dropdown-menu" aria-labelledby="mypageDropdown">
                                <li><Link className="dropdown-item" to="/wishList" onClick={handleProtectedNavigation}>찜
                                    목록</Link></li>
                                <li><Link className="dropdown-item" to="/myreviews" onClick={handleProtectedNavigation}>내가
                                    쓴 리뷰</Link></li>
                            </ul>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">환영합니다, {displayName}님!</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-primary custom-login-btn"
                                            style={{marginTop: '0.5rem', height: '3rem', fontSize: '1.2rem'}}
                                            onClick={handleLogoutClick}>Log Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">회원가입</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-primary custom-login-btn" style={{
                                        marginTop: '0.5rem',
                                        width: '6rem',
                                        height: '3rem',
                                        fontSize: '1.2rem'
                                    }} onClick={handleLoginClick}>Log In
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <Warning
                show={showWarning}
                message="로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
                onConfirm={handleConfirmWarning}
                onCancel={() => setShowWarning(false)}
            />
        </nav>
    );
};

export default Header;