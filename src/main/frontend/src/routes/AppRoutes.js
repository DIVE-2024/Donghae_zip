import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Restaurant from '../pages/Restaurant/Restaurant';
import Accommodation from '../pages/Accommodation/Accommodation';
import AccommodationList from '../pages/Accommodation/AccommodationList';
import SignUp from '../pages/SignUp/SignUp';
import Login from '../pages/Login/Login';
import LoginSuccess from "../services/LoginSuccess";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/accommodation/:uniqueId" element={<Accommodation />} />
            <Route path="/accommodations" element={<AccommodationList />} />
            <Route path="/accommodations/region/:region" element={<AccommodationList />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
        </Routes>
    );
};

export default AppRoutes;