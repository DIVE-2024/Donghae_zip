import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AccommodationList = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState(''); // 지역 상태 추가
    const [priceRange, setPriceRange] = useState(''); // 가격대 상태 추가
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = 15;

    // 가격 범위에 따른 minPrice, maxPrice 설정
    const getMinMaxPrice = () => {
        switch (priceRange) {
            case '0-30000':
                return { minPrice: 0, maxPrice: 30000 };
            case '30000-50000':
                return { minPrice: 30000, maxPrice: 50000 };
            case '50000-80000':
                return { minPrice: 50000, maxPrice: 80000 };
            case '80000-100000':
                return { minPrice: 80000, maxPrice: 100000 };
            case '100000-':
                return { minPrice: 100000, maxPrice: 10000000 }; // Set a reasonable upper limit, e.g., 1,000,000

            default:
                return { minPrice: 0, maxPrice: Number.MAX_SAFE_INTEGER };
        }
    };

    useEffect(() => {
        setLoading(true);
        const { minPrice, maxPrice } = getMinMaxPrice(); // 가격대별 최소, 최대 가격을 가져옴
        let url = `/api/accommodations?page=${page}&size=${itemsPerPage}`;

        // 지역과 가격대를 사용한 API 호출
        if (region && priceRange) {
            url = `/api/accommodations/region/${region}/price-range?page=${page}&size=${itemsPerPage}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
        } else if (region) {
            url = `/api/accommodations/region/${region}?page=${page}&size=${itemsPerPage}`;
        }

        axios.get(url)
            .then(response => {
                setAccommodations(response.data.content);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching accommodation data:', error);
                setLoading(false);
            });
    }, [page, region, priceRange]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            {/* 지역 필터 드롭다운 */}
            <div className="my-3">
                <select
                    className="form-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="">All Regions</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>
            </div>

            {/* 가격대 필터 드롭다운 */}
            <div className="my-3">
                <select
                    className="form-select"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                >
                    <option value="">All Prices</option>
                    <option value="0-30000">0 ~ 30,000원</option>
                    <option value="30000-50000">30,000 ~ 50,000원</option>
                    <option value="50000-80000">50,000 ~ 80,000원</option>
                    <option value="80000-100000">80,000 ~ 100,000원</option>
                    <option value="100000-">100,000원 이상</option>
                </select>
            </div>

            {/* 숙박 목록 */}
            <div className="row">
                {accommodations.map(accommodation => (
                    <div className="col-md-4" key={accommodation.uniqueId}>
                        <div className="card mb-4 shadow-sm">
                            <img
                                src={accommodation.imageUrl && accommodation.imageUrl !== '이미지 없음' ? accommodation.imageUrl : '/image/default_image.png'}
                                className="card-img-top"
                                alt={accommodation.name}
                                style={{
                                    height: '200px',
                                    width: '100%',
                                    objectFit: accommodation.imageUrl && accommodation.imageUrl !== '이미지 없음' ? 'cover' : 'contain'
                                }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{accommodation.name}</h5>
                                <p>{accommodation.address}</p>
                                <p style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '1rem' }}>
                                    평균 1일 숙박 비용: {accommodation.averagePrice.toLocaleString()}원
                                </p>
                                <Link to={`/accommodation/${accommodation.uniqueId}`} className="btn btn-primary">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(index)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AccommodationList;
