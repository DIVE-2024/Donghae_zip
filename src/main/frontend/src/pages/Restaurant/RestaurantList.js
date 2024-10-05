import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Trail/TrailListPage.css';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [restaurantCount, setRestaurantCount] = useState(0);

    const itemsPerPage = 15; // 한 페이지에 15개의 식당
    const maxPagesToShow = 5; // 1 ~ 5 페이지만 페이지네이션에 보여줌

    // Fetch hashtags and districts when region changes
    useEffect(() => {
        if (region) {
            axios.get(`/api/restaurants/region/${region}/hashtags`)
                .then(response => setHashtags(Object.keys(response.data)))
                .catch(error => console.error('Error fetching hashtags:', error));

            axios.get(`/api/restaurants/region/${region}/districts`)
                .then(response => setDistricts(response.data))
                .catch(error => console.error('Error fetching districts:', error));
        }
    }, [region]);

    // Fetch restaurant data based on filters
    const fetchRestaurants = useCallback(() => {
        setLoading(true);
        let url = `/api/restaurants?page=${page}&size=${itemsPerPage}`;

        if (region && !district && !hashtag) {
            url = `/api/restaurants/region/${region}?page=${page}&size=${itemsPerPage}`;
        } else if (region && district && !hashtag) {
            url = `/api/restaurants/searchByRegionAndDistrict?region=${region}&district=${district}&page=${page}&size=${itemsPerPage}`;
        } else if (region && district && hashtag) {
            url = `/api/restaurants/searchByDistrict?region=${region}&district=${district}&hashtag=${encodeURIComponent(hashtag)}&page=${page}&size=${itemsPerPage}`;
        }

        axios.get(url)
            .then(response => {
                setRestaurants(response.data.content);
                setRestaurantCount(response.data.totalElements);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restaurant data:', error);
                setLoading(false);
            });
    }, [region, district, hashtag, page]);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    // 페이지네이션을 위한 페이지 번호 계산
    const getPaginationGroup = () => {
        const startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);
        return [...Array(endPage - startPage + 1).keys()].map(num => startPage + num);
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="page-title">결과 총 {restaurantCount}개</h1>

            {/* Region Filter */}
            <div className="input-group filter-group mb-4">
                <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>

                {/* District Filter */}
                {region && (
                    <select className="form-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                        <option value="">구/군 선택</option>
                        {districts.map((dist, index) => (
                            <option key={index} value={dist}>
                                {dist}
                            </option>
                        ))}
                    </select>
                )}

                {/* Hashtag Filter */}
                {region && (
                    <select className="form-select" value={hashtag} onChange={(e) => setHashtag(e.target.value)}>
                        <option value="">모든 해시태그</option>
                        {hashtags.map((tag, index) => (
                            <option key={index} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                )}

                {/* Reset Button */}
                <button className="btn btn-secondary" onClick={() => {
                    setRegion('');
                    setDistrict('');
                    setHashtag('');
                    fetchRestaurants();
                }}>초기화</button>
            </div>

            {/* Restaurant List */}
            <div className="row">
                {restaurants.map(restaurant => (
                    <div className="col-md-4 mb-4" key={restaurant.id}>
                        <Link to={`/restaurant/${restaurant.id}`} className="card-link">
                            <div className="card h-100 trail-card">
                                <img
                                    src={restaurant.imageUrl && JSON.parse(restaurant.imageUrl).length > 0
                                        ? JSON.parse(restaurant.imageUrl)[0]
                                        : '/image/default_image.png'}
                                    className="card-img-top img-fixed"
                                    alt={restaurant.name}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title course-title">{restaurant.name}</h5>
                                    <p className="card-text course-overview">{restaurant.address}</p>
                                    <p className="trail-info">전화번호: {restaurant.phone}</p>
                                    <div className="mt-auto d-flex justify-content-end align-items-center">
                                        <Link to={`/restaurant/${restaurant.id}`} className="btn btn-primary review-btn me-2">
                                            상세 보기
                                        </Link>
                                        <i className="bi bi-heart heart-icon"></i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>이전</button>
                        </li>
                        {getPaginationGroup().map((pageNum) => (
                            <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(pageNum)}>
                                    {pageNum + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>다음</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default RestaurantList;