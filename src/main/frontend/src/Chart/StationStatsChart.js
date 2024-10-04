import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import './StationStatsChart.css';

const COLORS = [
    '#4E79A7', // 진한 파랑
    '#F28E2B', // 주황색
    '#E15759', // 진한 빨강
    '#76B7B2', // 청록색
    '#59A14F', // 초록색
    '#EDC948', // 밝은 노랑
    '#B07AA1', // 보라색
    '#FF9DA7', // 밝은 핑크
    '#9C755F', // 갈색
    '#BAB0AC'  // 회색
];

const StationStatsChart = () => {
    const [data, setData] = useState([]);
    const [yearsAndMonths, setYearsAndMonths] = useState([]);  // 연도와 월 목록
    const [weeks, setWeeks] = useState([]);  // 주차 목록
    const [yearAndMonth, setYearAndMonth] = useState('');  // 선택된 연도와 월
    const [week, setWeek] = useState('');  // 선택된 주차
    const [stationName, setStationName] = useState('');
    const [stations, setStations] = useState([]);  // 역 목록

    // 연도와 월 가져오기
    useEffect(() => {
        axios.get('/api/station-stats/years-and-months')
            .then(response => {
                setYearsAndMonths(response.data);
            })
            .catch(error => {
                console.error('Error fetching years and months:', error);
            });
    }, []);

    // 특정 연도와 월에 해당하는 주차 가져오기
    useEffect(() => {
        if (yearAndMonth) {
            axios.get(`/api/station-stats/weeks/${yearAndMonth}`)
                .then(response => {
                    setWeeks(response.data);
                })
                .catch(error => {
                    console.error('Error fetching weeks:', error);
                });
        }
    }, [yearAndMonth]);

    // 역 정보 가져오기 (백엔드에서)
    useEffect(() => {
        axios.get('/api/station-stats/stations')
            .then(response => {
                setStations(response.data);
            })
            .catch(error => {
                console.error('Error fetching stations:', error);
            });
    }, []);

    // 주차와 역에 해당하는 데이터 가져오기 및 비율 계산
    useEffect(() => {
        if (yearAndMonth && week && stationName) {
            const year = yearAndMonth.slice(0, 5);  // "2023" 추출
            const month = yearAndMonth.slice(6, 9); // "01" 추출
            const weekNumber = week.match(/(\d+)주차/)?.[1];  // "2주차" -> "2" 추출
            const weekWithSuffix = `${weekNumber}주차`;

            // API 요청
            axios.get(`/api/station-stats/${stationName}/${year}/${month}/${weekWithSuffix}`)
                .then(response => {
                    const stats = response.data;
                    console.log("Received stats:", stats);

                    // 실제 승차/하차 인원 및 비율 계산
                    const totalBoarding = stats.reduce((acc, curr) => acc + curr.avgBoardingPassengers, 0);
                    const totalAlighting = stats.reduce((acc, curr) => acc + curr.avgAlightingPassengers, 0);

                    const percentageData = stats.map((entry) => ({
                        timePeriod: entry.timePeriod,
                        boardingPercentage: totalBoarding ? (entry.avgBoardingPassengers / totalBoarding) * 100 : 0,
                        alightingPercentage: totalAlighting ? (entry.avgAlightingPassengers / totalAlighting) * 100 : 0,
                        boardingPassengers: entry.avgBoardingPassengers,  // 실제 승차 인원 추가
                        alightingPassengers: entry.avgAlightingPassengers  // 실제 하차 인원 추가
                    }));

                    setData(percentageData);
                })
                .catch(error => {
                    console.error('Error fetching station stats:', error);
                });
        }
    }, [yearAndMonth, week, stationName]);

// 차트 부분
    return (
        <div>
            <div>
                {/* 연도와 월 선택 필터 */}
                <div style={{display: 'flex', gap: '1rem'}}>
                    <select
                        onChange={(e) => setYearAndMonth(e.target.value)}
                        style={{fontSize: '1.2rem', padding: '0.5rem', height: '3rem'}}  // 크기 조정
                    >
                        <option value="">연도와 월 선택</option>
                        {yearsAndMonths.map((ym, index) => (
                            <option key={index} value={ym}>
                                {ym}
                            </option>
                        ))}
                    </select>

                    <select
                        onChange={(e) => setWeek(e.target.value)}
                        style={{fontSize: '1.2rem', padding: '0.5rem', height: '3rem'}}  // 크기 조정
                    >
                        <option value="">주차 선택</option>
                        {weeks.map((week, index) => (
                            <option key={index} value={week}>
                                {week}
                            </option>
                        ))}
                    </select>

                    <select
                        onChange={(e) => setStationName(e.target.value)}
                        style={{fontSize: '1.2rem', padding: '0.5rem', height: '3rem'}}  // 크기 조정
                    >
                        <option value="">역 선택</option>
                        {stations.map((station, index) => (
                            <option key={index} value={station}>
                                {station}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* 승차 비율 파이 차트 */}
            {data.length > 0 && (
                <div style={{display: 'flex', gap: '5rem', justifyContent: 'center', marginTop: '5rem'}}>
                    {/* 승차 비율 파이 차트 */}
                    <div>
                        <h3>시간대별 평균 승차 비율</h3>
                        <PieChart width={600} height={700}>
                            <Pie
                                data={data}
                                dataKey="boardingPercentage"
                                nameKey="timePeriod"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                labelLine={true}
                                label={({percent}) => `${(percent * 100).toFixed(1)}%`}
                                minAngle={6}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`}/>
                            <Legend
                                formatter={(value, entry) => {
                                    const boardingPassengers = entry.payload.boardingPassengers;  // 실제 승차 인원
                                    return `${value}: (${boardingPassengers}명)`;  // 시간대와 실제 승차 인원 표시
                                }}
                            />
                        </PieChart>
                    </div>

                    {/* 하차 비율 파이 차트 */}
                    <div>
                        <h3>시간대별 평균 하차 비율</h3>
                        <PieChart width={600} height={700}>
                            <Pie
                                data={data}
                                dataKey="alightingPercentage"
                                nameKey="timePeriod"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#82ca9d"
                                label={({percent}) => `${(percent * 100).toFixed(1)}%`}
                                minAngle={6}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`}/>
                            <Legend
                                formatter={(value, entry) => {
                                    const alightingPassengers = entry.payload.alightingPassengers;  // 실제 하차 인원
                                    return `${value}: (${alightingPassengers}명)`;  // 시간대와 실제 하차 인원 표시
                                }}
                            />
                        </PieChart>
                    </div>
                </div>
            )}
        </div>
    );

};

export default StationStatsChart;
