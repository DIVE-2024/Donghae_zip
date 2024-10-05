import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Trail/TrailListPage.css';

const AccommodationList = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAccommodations, setTotalAccommodations] = useState(0); // 총 숙박 수 상태 추가
    const [currentPage, setCurrentPage] = useState(0);
    const [region, setRegion] = useState('');
    const [priceRange, setPriceRange] = useState('');

    const itemsPerPage = 15;

    // 페이지네이션에서 1에서 5까지만 표시되도록 설정
    const maxPageNumbersToShow = 5;

    const fetchAccommodations = useCallback(() => {
        let apiUrl = `/api/accommodations?page=${currentPage}&size=${itemsPerPage}`;

        if (region) {
            apiUrl = `/api/accommodations/region/${region}?page=${currentPage}&size=${itemsPerPage}`;
        }

        if (region && priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-');
            apiUrl = `/api/accommodations/region/${region}/price-range?page=${currentPage}&size=${itemsPerPage}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
        }

        axios.get(apiUrl)
            .then(response => {
                setAccommodations(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalAccommodations(response.data.totalElements); // 총 숙박 수 설정
            })
            .catch(error => {
                console.error('Error fetching accommodation data:', error);
            });
    }, [region, priceRange, currentPage]);

    useEffect(() => {
        fetchAccommodations();
    }, [fetchAccommodations]);

    // 페이지 번호 렌더링
    const renderPagination = () => {
        const pages = [];
        const startPage = Math.max(0, currentPage - Math.floor(maxPageNumbersToShow / 2));
        const endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i)}>
                        {i + 1}
                    </button>
                </li>
            );
        }

        return (
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                            이전
                        </button>
                    </li>
                    {pages}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                            다음
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    return (
        <div className="container mt-5">
            {/* 결과 총 숙박 수 표시 */}
            <h1 className="page-title">결과 총 {totalAccommodations}개</h1>

            <div className="input-group filter-group mb-4">
                <select
                    className="form-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>

                <select
                    className="form-select"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                >
                    <option value="">가격대 선택</option>
                    <option value="0-30000">0 ~ 30,000원</option>
                    <option value="30000-50000">30,000 ~ 50,000원</option>
                    <option value="50000-80000">50,000 ~ 80,000원</option>
                    <option value="80000-100000">80,000 ~ 100,000원</option>
                    <option value="100000-">100,000원 이상</option>
                </select>

                <button className="btn btn-secondary" onClick={() => {
                    setRegion('');
                    setPriceRange('');
                    fetchAccommodations();
                }}>초기화</button>
            </div>

            <div className="row">
                {accommodations && accommodations.length > 0 ? (
                    accommodations.map((accommodation) => (
                        <div key={accommodation.uniqueId} className="col-md-4 mb-4">
                            <Link to={`/accommodation/${accommodation.uniqueId}`} className="card-link">
                                <div className="card h-100 trail-card">
                                    <img src={accommodation.imageUrl || '/image/default_image.png'} className="card-img-top img-fixed" alt={accommodation.name} />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title course-title">{accommodation.name}</h5>
                                        <p className="card-text course-overview">{accommodation.address}</p>
                                        <p className="trail-info">
                                            {accommodation.averagePrice.toLocaleString()}원
                                        </p>
                                        <div className="mt-auto d-flex justify-content-end align-items-center">
                                            <Link to={`/accommodation/${accommodation.uniqueId}`} className="btn btn-primary review-btn me-2">
                                                상세 보기
                                            </Link>
                                            <i className="bi bi-heart heart-icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No accommodations found</p>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && renderPagination()}
        </div>
    );
};

export default AccommodationList;