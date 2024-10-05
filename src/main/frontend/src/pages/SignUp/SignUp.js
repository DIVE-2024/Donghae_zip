import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate 훅 사용
import { signUp } from '../../services/authService';  // authService에서 signUp 함수 가져오기
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap 사용

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        nickname: '',
        phone: '',
        age: ''
    });

    const navigate = useNavigate();  // navigate 함수 가져오기

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUp = async () => {
        try {
            await signUp(formData);  // 백엔드로 회원가입 요청
            console.log("회원가입 성공");
            // 회원가입 성공 시 메인 페이지로 리다이렉트
            navigate('/');  // 메인 페이지로 이동
        } catch (error) {
            console.error("회원가입 에러:", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', minWidth: '100vw', backgroundColor: '#B4C2D7' }}>
            <div className="card p-4 shadow-lg" style={{ width: '400px', backgroundColor: '#F7FAFC' }}>
                <h2 className="text-center mb-4">회원가입</h2>
                <form>
                    <div className="form-group mb-3">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="이름"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email">아이디 (E-Mail)</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="이메일"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="비밀번호"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="nickname">닉네임</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nickname"
                            name="nickname"
                            placeholder="닉네임"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="age">나이</label>
                        <input
                            type="number"
                            className="form-control"
                            id="age"
                            name="age"
                            placeholder="나이"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            placeholder="전화번호"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="button" className="btn btn-dark w-100" onClick={handleSignUp}>가입하기</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;