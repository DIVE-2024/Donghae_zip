import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const RestaurantListByHashtag = () => {
    const { region, hashtag } = useParams();  // URL에서 region과 hashtag 값을 가져옴
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);  // 페이지 상태 추가
    const [totalPages, setTotalPages] = useState(0);  // 전체 페이지 수

    useEffect(() => {
        setLoading(true);
        // 지역 및 해시태그에 따라 식당 목록 가져오기 (페이지네이션)
        axios.get(`/api/restaurants/region/${region}/hashtag/${hashtag}?page=${page}&size=10`)
            .then(response => {
                setRestaurants(response.data.content);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restaurants by hashtag:', error);
                setLoading(false);
            });
    }, [region, hashtag, page]);  // 페이지가 변경될 때마다 다시 데이터 로드

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="container">
            <h3>{hashtag} 음식점 목록</h3>
            <div className="row">
                {restaurants.map((restaurant, index) => (
                    <div className="col-md-3" key={index}>
                        <div className="card mb-4 shadow-sm">
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
                                <Link to={`/restaurant/${restaurant.id}`} className="btn btn-primary">
                                    상세 보기
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        {/* 이전 페이지 버튼 */}
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>이전</button>
                        </li>

                        {/* 페이지 번호 버튼 */}
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(index)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        {/* 다음 페이지 버튼 */}
                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>다음</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default RestaurantListByHashtag;
