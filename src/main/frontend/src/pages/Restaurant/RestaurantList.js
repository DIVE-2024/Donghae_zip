import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');  // Add district filter
    const [hashtag, setHashtag] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [districts, setDistricts] = useState([]);  // State for districts
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = 15;

    // Fetch hashtags based on region
    useEffect(() => {
        if (region) {
            axios.get(`/api/restaurants/region/${region}/hashtags`)
                .then(response => {
                    setHashtags(Object.keys(response.data));
                })
                .catch(error => {
                    console.error('Error fetching hashtags:', error);
                });
        }
    }, [region]);

    // Fetch districts based on region
    useEffect(() => {
        if (region) {
            axios.get(`/api/restaurants/region/${region}/districts`)
                .then(response => {
                    setDistricts(response.data);  // Assume the backend provides a list of districts
                })
                .catch(error => {
                    console.error('Error fetching districts:', error);
                });
        }
    }, [region]);

    // Fetch restaurant data based on filters
    // Fetch restaurant data based on filters
    useEffect(() => {
        setLoading(true);

        let url = `/api/restaurants?page=${page}&size=${itemsPerPage}`;

        if (region && !district && !hashtag) {
            url = `/api/restaurants/region/${region}?page=${page}&size=${itemsPerPage}`;
        } else if (region && district && !hashtag) {
            // 지역과 구/군만 선택된 경우, 해시태그는 없이 필터링
            url = `/api/restaurants/searchByRegionAndDistrict?region=${region}&district=${district}&page=${page}&size=${itemsPerPage}`;
        } else if (region && district && hashtag) {
            // 지역, 구/군, 해시태그 모두 선택된 경우
            url = `/api/restaurants/searchByDistrict?region=${region}&district=${district}&hashtag=${encodeURIComponent(hashtag)}&page=${page}&size=${itemsPerPage}`;
        }

        axios.get(url)
            .then(response => {
                setRestaurants(response.data.content);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restaurant data:', error);
                setLoading(false);
            });
    }, [region, district, hashtag, page]);


    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="container">
            {/* Region Filter */}
            <div className="my-3">
                <select
                    className="form-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>
            </div>

            {/* District Filter */}
            {region && (
                <div className="my-3">
                    <select
                        className="form-select"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    >
                        <option value="">구/군 선택</option>
                        {districts.map((dist, index) => (
                            <option key={index} value={dist}>
                                {dist}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Hashtag Filter */}
            {region && (
                <div className="my-3">
                    <select
                        className="form-select"
                        value={hashtag}
                        onChange={(e) => setHashtag(e.target.value)}
                    >
                        <option value="">모든 해시태그</option>
                        {hashtags.map((tag, index) => (
                            <option key={index} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Restaurant List */}
            <div className="row">
                {restaurants.map(restaurant => (
                    <div className="col-md-4" key={restaurant.id}>
                        <div className="card mb-4 shadow-sm">
                            {/* Restaurant Image */}
                            <img
                                src={
                                    restaurant.imageUrl && JSON.parse(restaurant.imageUrl).length > 0
                                        ? JSON.parse(restaurant.imageUrl)[0]
                                        : '/image/default_image.png'
                                }
                                className="card-img-top"
                                alt={restaurant.name}
                                style={{
                                    height: '200px',
                                    width: '100%',
                                    objectFit: JSON.parse(restaurant.imageUrl).length > 0 ? 'cover' : 'contain'
                                }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{restaurant.name}</h5>
                                <p>{restaurant.address}</p>
                                <p style={{fontWeight: 'bold', color: '#2c3e50', fontSize: '1rem'}}>
                                    전화번호: {restaurant.phone}
                                </p>
                                <Link to={`/restaurant/${restaurant.id}`} className="btn btn-primary">
                                    상세 보기
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
                            <button className="page-link" onClick={() => setPage(page - 1)}>이전</button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(index)}>
                                    {index + 1}
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
