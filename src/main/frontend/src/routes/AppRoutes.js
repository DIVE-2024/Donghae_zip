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

const AppRoutes = () => {
    return (
        <Routes>
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
        </Routes>
    );
};

export default AppRoutes;