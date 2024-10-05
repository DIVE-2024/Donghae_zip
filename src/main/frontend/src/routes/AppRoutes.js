import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Restaurant from '../pages/Restaurant/Restaurant';
import Accommodation from '../pages/Accommodation/Accommodation';
import AccommodationList from '../pages/Accommodation/AccommodationList';
import SignUp from '../pages/SignUp/SignUp';
import Login from '../pages/Login/Login';
import LoginSuccess from "../services/LoginSuccess";
import RestaurantList from "../pages/Restaurant/RestaurantList";
import RestaurantListByHashtag from "../pages/Restaurant/RestaurantListByHashtag";
import DonghaeMapPlace from "../Donghae/DonghaeMapPlace";
import StationStatsChart from "../Chart/StationStatsChart";
import DonghaeSubway from "../Donghae/DonghaeSubway";
import ImageMapWithCoordinates from "../Donghae/ImageMapWithCoordinates";

const AppRoutes = () => {
    return (
        <Routes>
                <Route path="/image-cord" element={<ImageMapWithCoordinates/>} />
            {/* 식당 */}
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/restaurants/region/:region" element={<RestaurantList />} />
            <Route path="/restaurants/:region/hashtag/:hashtag" element={<RestaurantListByHashtag />} />
            {/* 숙소 */}
            <Route path="/accommodation/:uniqueId" element={<Accommodation />} />
            <Route path="/accommodations" element={<AccommodationList />} />
            <Route path="/accommodations/region/:region" element={<AccommodationList />} />
            {/* 로그인 및 회원가입 */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
            {/* 차트 페이지 추가 */}
            <Route path="/station-stats" element={<StationStatsChart />} />
            {/* 동해선 핫플레이스 페이지 추가 */}
            <Route path="/donghae-hotplace" element={<DonghaeMapPlace />} />
            {/* 동해선 노선도 페이지 추가 */}
            <Route path="/donghae-subway" element={<DonghaeSubway />} />

        </Routes>
    );
};

export default AppRoutes;