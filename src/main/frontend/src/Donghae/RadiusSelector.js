import React from 'react';

const RadiusSelector = ({ radius, setRadius }) => {
    return (
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center'}}>
            <label style={{fontSize:'1.5rem'}}>반경 선택:</label>
            <select value={radius} onChange={(e) => setRadius(parseInt(e.target.value, 10))}>
                <option value={1000}>1km</option>
                <option value={1500}>1.5km</option>
                <option value={2000}>2km</option>
                <option value={3000}>3km</option>
            </select>
        </div>
    );
};

export default RadiusSelector;
