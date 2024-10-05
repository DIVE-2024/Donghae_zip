import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TrailListPage.css';

const TrailListPage = () => {
    const [trails, setTrails] = useState([]);
    const [trailCount, setTrailCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 번호
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [favoriteTrails, setFavoriteTrails] = useState([]);  // 사용자의 찜 목록

    const itemsPerPage = 15;

    // 사용자 찜 목록 가져오기
    const fetchFavoriteTrails = useCallback(() => {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');

        if (!userId) {
            console.error('userId가 세션에 저장되지 않았습니다.');
            return;
        }

        axios.get(`/api/favorites/auth/trails/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page: 0,
                size: 10
            }
        })
            .then(response => {
                console.log('찜 목록 데이터:', response.data);
                const favoriteTrailIds = response.data.content.map(fav => fav.trail.trailId);  // trailId 배열로 변환
                setFavoriteTrails(favoriteTrailIds);  // 찜 목록을 상태로 저장
            })
            .catch(error => {
                console.error('Error fetching trails:', error);
            });
    }, []);

    // 트레일 목록 API 호출 함수
    const fetchTrails = useCallback(() => {
        let apiUrl = `/api/trails?page=${currentPage}&size=${itemsPerPage}`;

        if (title) {
            apiUrl = `/api/trails/search/title?title=${title}&page=${currentPage}&size=${itemsPerPage}`;
        } else if (difficulty) {
            apiUrl = `/api/trails/search/difficulty?difficulty=${difficulty}&page=${currentPage}&size=${itemsPerPage}`;
        } else if (sortOption === "time") {
            apiUrl = `/api/trails/sort/time?direction=asc&page=${currentPage}&size=${itemsPerPage}`;
        } else if (sortOption === "length") {
            apiUrl = `/api/trails/sort/length?direction=asc&page=${currentPage}&size=${itemsPerPage}`;
        }

        axios.get(apiUrl)
            .then(response => {
                console.log("API 응답 데이터:", response.data);
                setTrails(response.data.content || response.data); // content를 사용하여 데이터를 매핑
                setTrailCount(response.data.totalElements || response.data.length); // 요소 개수 설정
                setTotalPages(response.data.totalPages || 1);  // 전체 페이지 수 설정
            })
            .catch(error => {
                console.error('Error fetching trail data:', error);
            });
    }, [title, difficulty, sortOption, currentPage]);

    useEffect(() => {
        fetchTrails();
        fetchFavoriteTrails();  // 사용자의 찜 목록도 가져옴
    }, [fetchTrails, fetchFavoriteTrails]);

    // 필터가 변경되면 다시 API 호출
    const handleFilterChange = () => {
        fetchTrails();
    };

    // 필터 초기화 함수
    const resetFilters = () => {
        setTitle("");        // 제목 검색 초기화
        setDifficulty("");   // 난이도 필터 초기화
        setSortOption("");   // 정렬 옵션 초기화
        fetchTrails();       // 전체 코스 다시 불러오기
    };

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-5">
            {/* "결과 총 00개" */}
            <h1 className="page-title">결과 총 {trailCount}개</h1>

            {/* 필터 그룹: 제목 검색, 난이도 선택, 정렬 선택 */}
            <div className="input-group filter-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="제목 검색"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleFilterChange}
                />

                <select
                    className="form-select"
                    value={difficulty}
                    onChange={(e) => { setDifficulty(e.target.value); handleFilterChange(); }}
                >
                    <option value="">난이도 선택</option>
                    <option value="쉬움">쉬움</option>
                    <option value="보통">보통</option>
                    <option value="어려움">어려움</option>
                </select>

                <select
                    className="form-select"
                    value={sortOption}
                    onChange={(e) => { setSortOption(e.target.value); handleFilterChange(); }}
                >
                    <option value="">정렬 옵션 선택</option>
                    <option value="time">소요시간순</option>
                    <option value="length">소요거리순</option>
                </select>

                {/* 필터 초기화 버튼 */}
                <button className="btn btn-secondary" onClick={resetFilters}>
                    초기화
                </button>
            </div>

            {/* 둘레길 목록 렌더링 */}
            <div className="row">
                {trails && trails.length > 0 ? (
                    trails.map((trail) => (
                        <div key={trail.trailId} className="col-md-4 mb-4">
                            <Link to={`/trails/${trail.trailId}`} className="card-link">
                                <div className="card h-100 trail-card">
                                    <img src={trail.imageUrls[0]} className="card-img-top img-fixed" alt={trail.courseName} />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title course-title">{trail.courseName}</h5>
                                        <p className="card-text course-overview">{trail.courseOverview}</p>
                                        <p className="trail-info">
                                            {trail.lengthInKm}km
                                            <span className="dot"></span>
                                            {Math.floor(trail.timeInMinutes / 60)}시간 {trail.timeInMinutes % 60}분
                                            <span className="dot"></span>
                                            {trail.difficulty}
                                        </p>
                                        <div className="mt-auto d-flex justify-content-end align-items-center">
                                            <Link to={`/trails/${trail.trailId}`} className="btn btn-primary review-btn me-2">
                                                리뷰 {trail.reviewCount}개
                                            </Link>
                                            {/* 하트 아이콘: 찜한 코스는 채워진 하트, 그렇지 않은 코스는 빈 하트 */}
                                            <i
                                                className={`bi bi-heart${favoriteTrails.includes(trail.trailId) ? '-fill' : ''} heart-icon`}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No trails found</p>
                )}
            </div>

            {/* 페이지네이션 */}
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}>
                                이전
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i).map(pageNumber => (
                            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                                    {pageNumber + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages - 1))}>
                                다음
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default TrailListPage;