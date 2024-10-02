import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Restaurant from './Restaurant/Restaurant';
import Accommodation from './Accommodation/Accommodation';
import AccommodationList from './Accommodation/AccommodationList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/loginSuccess" element={<LoginSuccess />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/accommodation/:uniqueId" element={<Accommodation />} />
                {/* 전체 숙박시설 목록 */}
                <Route path="/accommodations" element={<AccommodationList />} />
                {/* 지역별 숙박시설 목록 */}
                <Route path="/accommodations/region/:region" element={<AccommodationList />} />
            </Routes>
        </Router>
    );
}

function LoginSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    return (
        <div className="container text-center mt-5">
            <h2 className="text-success">Login Successful</h2>
            <p className="text-muted">Your JWT Token:</p>
            <p className="alert alert-info" style={{ wordBreak: 'break-all' }}>{token}</p>
            <button className="btn btn-primary mt-3" onClick={() => window.location.href = '/login'}>Go back to Login</button>
        </div>
    );
}

export default App;