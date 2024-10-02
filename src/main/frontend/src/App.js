import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Router 관련 컴포넌트 import
import Header from "./components/Header";
import Footer from "./components/Footer";
import Restaurant from './Restaurant/Restaurant';
import Accommodation from './Accommodation/Accommodation';
import AccommodationList from './Accommodation/AccommodationList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="App">
            <Header />
            {/* 페이지 콘텐츠 */}
            <div style={{ minHeight: "calc(100vh - 200px)" }}>
                {/* 여기에 페이지 별 컨텐츠가 들어갈 수 있습니다 */}
            </div>
            <Footer />

            <Router>
                <Routes>
                    <Route path="/restaurant/:id" element={<Restaurant />} />
                    <Route path="/accommodation/:uniqueId" element={<Accommodation />} />
                    {/* 전체 숙박시설 목록 */}
                    <Route path="/accommodations" element={<AccommodationList />} />
                    {/* 지역별 숙박시설 목록 */}
                    <Route path="/accommodations/region/:region" element={<AccommodationList />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;