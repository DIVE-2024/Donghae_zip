import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TouristSpotList.css';

const TouristSpotList = () => {
    const [spots, setSpots] = useState([]);
    const [spotCount, setSpotCount] = useState(0);
    const [title, setTitle] = useState("");  // 제목 필터
    const [category, setCategory] = useState("");  // 카테고리 필터
    const [region, setRegion] = useState("");  // 지역 필터
    const [indoorOutdoor, setIndoorOutdoor] = useState("");  // 실내/실외 필터
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = 15;
    const maxPageButtons = 5; // 페이지 버튼을 5개로 제한

    // API 호출 함수: 제목, 카테고리, 지역, 실내/실외 필터에 따라 다르게 호출
    const fetchSpots = useCallback(() => {
        let apiUrl = `/api/tourist-spots/all?page=${page}&size=${itemsPerPage}`;

        if (title) {
            apiUrl = `/api/tourist-spots/search/title?title=${title}&page=${page}&size=${itemsPerPage}`;
        } else if (category) {
            apiUrl = `/api/tourist-spots/category?category=${category}&page=${page}&size=${itemsPerPage}`;
        } else if (region) {
            apiUrl = `/api/tourist-spots/search/region?region=${region}&page=${page}&size=${itemsPerPage}`;
        } else if (indoorOutdoor) {
            apiUrl = `/api/tourist-spots/${indoorOutdoor}?page=${page}&size=${itemsPerPage}`;
        }

        axios.get(apiUrl)
            .then(response => {
                setSpots(response.data.content || response.data);
                setSpotCount(response.data.totalElements || response.data.length);
                setTotalPages(response.data.totalPages || 1);
            })
            .catch(error => {
                console.error('Error fetching tourist spots data:', error);
            });
    }, [title, category, region, indoorOutdoor, page]);

    useEffect(() => {
        fetchSpots();
    }, [fetchSpots]);

    // 카테고리 필터를 버튼 클릭 시 적용
    const handleCategoryClick = (selectedCategory) => {
        setCategory(selectedCategory);
        setPage(0);  // 필터 변경 시 페이지 초기화
    };

    // 필터 초기화 함수
    const resetFilters = () => {
        setTitle("");
        setCategory("");
        setRegion("");
        setIndoorOutdoor("");
        setPage(0);
        fetchSpots(); // 전체 데이터 다시 불러오기
    };

    // 페이지네이션에서 현재 페이지 그룹의 시작 페이지 번호
    const startPage = Math.floor(page / maxPageButtons) * maxPageButtons;
    const endPage = Math.min(startPage + maxPageButtons, totalPages);

    return (
        <div className="container mt-5">
            {/* "결과 총 00개" */}
            <h1 className="page-title">결과 총 {spotCount}개</h1>

            {/* 필터 그룹 */}
            <div className="input-group filter-group mb-4">
                {/* 제목 검색 필터 */}
                <input
                    type="text"
                    className="form-control"
                    placeholder="제목 검색"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={fetchSpots}  // 입력이 끝난 후 검색
                />

                {/* 지역 선택 필터 */}
                <select
                    className="form-select"
                    value={region}
                    onChange={(e) => { setRegion(e.target.value); setPage(0); fetchSpots(); }}
                >
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>

                {/* 실내/실외 선택 필터 */}
                <select
                    className="form-select"
                    value={indoorOutdoor}
                    onChange={(e) => { setIndoorOutdoor(e.target.value); setPage(0); fetchSpots(); }}
                >
                    <option value="">실내/실외 선택</option>
                    <option value="indoor">실내</option>
                    <option value="outdoor">실외</option>
                </select>

                {/* 필터 초기화 버튼 */}
                <button className="btn btn-secondary ml-2" onClick={resetFilters}>초기화</button>
            </div>

            {/* 카테고리 필터 박스 */}
            <div className="category-box">
                <h3 className="category-title">카테고리 필터</h3>
                <div className="category-buttons mb-4">
                    <button className="category-btn" onClick={() => handleCategoryClick('공원')}>공원</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('문화시설')}>문화시설</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('레포츠')}>레포츠</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('테마거리')}>테마거리</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('쇼핑')}>쇼핑</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('문화유산')}>문화유산</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('산책로')}>산책로</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('해수욕장')}>해수욕장</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('시장')}>시장</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('마을')}>마을</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('사찰')}>사찰</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('체험시설')}>체험시설</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('지질공원')}>지질공원</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('테마파크')}>테마파크</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('놀이시설')}>놀이시설</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('키즈카페')}>키즈카페</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('전시관')}>전시관</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('식물원')}>식물원</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('계곡')}>계곡</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('영화관')}>영화관</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('아쿠아리움')}>아쿠아리움</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('해안지역')}>해안지역</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('유적지')}>유적지</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('상점')}>상점</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('도시')}>도시</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('공방')}>공방</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('스파')}>스파</button>
                    <button className="category-btn" onClick={() => handleCategoryClick('명소')}>명소</button>
                </div>
            </div>

            {/* 관광지 목록 */}
            <div className="row">
                {spots.map((spot) => (
                    <div key={spot.spotId} className="col-md-4 mb-4">
                        <Link to={`/tourist-spot/${spot.spotId}`} className="card-link">
                            <div className="card h-100 tourist-spot-card">
                                <img src={spot.imageUrls[0]} className="card-img-top img-fixed" alt={spot.title} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title spot-title">{spot.title}</h5>
                                    <p className="card-text spot-overview">{spot.oneLineDesc}</p>
                                    <p className="spot-info">
                                        {spot.address}
                                        <span className="dot"></span>
                                        {spot.region}
                                    </p>
                                    <div className="mt-auto d-flex justify-content-end align-items-center">
                                        <Link to={`/tourist-spot/${spot.spotId}`} className="btn btn-primary review-btn me-2">
                                            리뷰 {spot.reviewCount}개
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
                        {/* 이전 버튼 */}
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(Math.max(page - 1, 0))}>이전</button>
                        </li>

                        {/* 페이지 번호들 */}
                        {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map(pageNumber => (
                            <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(pageNumber)}>
                                    {pageNumber + 1}
                                </button>
                            </li>
                        ))}

                        {/* 다음 버튼 */}
                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(Math.min(page + 1, totalPages - 1))}>다음</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default TouristSpotList;