import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Router 관련 컴포넌트 import
import Header from "./components/Header";
import Footer from "./components/Footer";
import Restaurant from './Restaurant/Restaurant';
import Accommodation from './Accommodation/Accommodation';
import AccommodationList from './Accommodation/AccommodationList';
import RestaurantList from './Restaurant/RestaurantList';
import RestaurantListByHashtag from './Restaurant/RestaurantListByHashtag';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* 특정 식당 페이지 */}
                <Route path="/restaurant/:id" element={<Restaurant />} />

                {/* 전체 식당 목록 페이지 */}
                <Route path="/restaurants" element={<RestaurantList />} />

                {/* 지역별 식당 목록 페이지 */}
                <Route path="/restaurants/region/:region" element={<RestaurantList />} />

                {/* 특정 숙박 시설 페이지 */}
                <Route path="/accommodation/:uniqueId" element={<Accommodation />} />

                {/* 전체 숙박시설 목록 페이지 */}
                <Route path="/accommodations" element={<AccommodationList />} />

                {/* 지역별 숙박시설 목록 페이지 */}
                <Route path="/accommodations/region/:region" element={<AccommodationList />} />


                {/* 해시태그별 더보기 페이지 */}
                <Route path="/restaurants/:region/hashtag/:hashtag" element={<RestaurantListByHashtag />} />
            </Routes>
        </Router>
    );
}


export default App;
