import React, { useState } from 'react';
import { login, redirectToSocialLogin } from '../../services/authService';  // authService에서 login, redirectToSocialLogin 함수 가져오기
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap 사용
import './Login.css'

// SVG 파일 import
import NaverLogo from '../../assets/images/btn_naver.svg';  // Naver 로그인 이미지 경로
import GoogleLogo from '../../assets/images/btn_google.svg';  // Google 로그인 이미지 경로
import KakaoLogo from '../../assets/images/btn_kakao.svg';  // Kakao 로그인 이미지 경로

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberId, setRememberId] = useState(false); // 아이디 저장 체크박스 상태

    const handleLogin = async () => {
        try {
            const loginData = { email, password };
            const { nickname, member, token } = await login(loginData);  // 백엔드로 로그인 요청

            // JWT 토큰을 저장
            sessionStorage.setItem('token', token);

            // 로그인 성공 후 메인 페이지로 리다이렉트
            window.location.href = '/';
            console.log("로그인 성공:", nickname, member, token);
        } catch (error) {
            console.error("로그인 에러:", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', minWidth: '100vw', backgroundColor: '#B4C2D7' }}>
            <div className="card p-4 shadow-lg" style={{ width: '1000px', backgroundColor: '#F7FAFC',height:'800px',justifyContent:'center'}}>
                <h2 className="text-center mb-4">로그인</h2>
                <form>
                    <div className="form-group mb-3">
                        <label style={{fontSize:'1.5rem'}} htmlFor="email">아이디 (E-Mail)</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label style={{fontSize:'1.5rem'}} htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                        />
                    </div>
                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberId"
                            checked={rememberId}
                            onChange={() => setRememberId(!rememberId)}
                        />
                        <label style={{marginTop:'2rem',fontSize:'1.5rem'}} className="form-check-label" htmlFor="rememberId">아이디 저장</label>
                    </div>
                    <button type="button" style={{fontSize:'1.5rem'}} className="btn btn-dark w-100 mb-3" onClick={handleLogin}>로그인</button>

                    {/* 소셜 로그인 버튼 */}
                    <div style={{marginTop:'4rem'}}>
                        <button type="button" className="btn btn-light w-100 mb-2 d-flex align-items-center justify-content-start" onClick={() => redirectToSocialLogin('naver')}>
                            <img src={NaverLogo} alt="Naver" style={{ height: '30px', marginRight: '10px' }} />
                            네이버로 로그인
                        </button>
                        <button type="button" className="btn btn-light w-100 mb-2 d-flex align-items-center justify-content-start" onClick={() => redirectToSocialLogin('google')}>
                            <img src={GoogleLogo} alt="Google" style={{ height: '30px', marginRight: '10px' }} />
                            구글로 로그인
                        </button>
                        <button type="button" className="btn btn-light w-100 d-flex align-items-center justify-content-start" onClick={() => redirectToSocialLogin('kakao')}>
                            <img src={KakaoLogo} alt="Kakao" style={{ height: '30px', marginRight: '10px' }} />
                            카카오로 시작하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;