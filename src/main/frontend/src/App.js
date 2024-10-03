import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage/MainPage"; // 메인 페이지 컴포넌트 가져오기
import AppRoutes from './routes/AppRoutes';  // 로그인, 회원가입, 기타 경로 처리
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Header />  {/* Header는 항상 렌더링 */}
                <Routes>
                    <Route path="/" element={<MainPage />} />  {/* 메인 페이지는 "/" 경로에서만 렌더링 */}
                    <Route path="/*" element={<AppRoutes />} />  {/* 나머지 페이지는 AppRoutes로 */}
                </Routes>
                <Footer />  {/* Footer도 항상 렌더링 */}
            </Router>
        </div>
    );
}

export default App;