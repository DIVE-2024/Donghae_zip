import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TrailListPage.css';
import ReviewCount from "../../components/Comment/ReviewCount";
import {getUserIdFromToken } from "../../components/Util/jwtUtils";
import AverageRating from "../../components/Comment/AverageRating";

const TrailListPage = () => {
    const [trails, setTrails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trailCount, setTrailCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 번호
    const [title, setTitle] = useState("");
    const [page, setPage] = useState(0);
    const [difficulty, setDifficulty] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [favoriteTrails, setFavoriteTrails] = useState([]);  // 사용자의 찜 목록
    const [userId,setUserId] = useState(null);

    const itemsPerPage = 15;

    // 초기 로드 시 JWT에서 userId 설정
    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);
    }, []);


    const fetchFavoriteTrail = useCallback(() => {
        const token = sessionStorage.getItem('token');
        const userId = getUserIdFromToken();

        if (!userId || !token) return;

        axiosInstance.get(`/api/favorites/auth/trails/${userId}`, {
            params: {
                page: page,
                size: itemsPerPage  // 찜 목록 크기
            }
        })
            .then(response => {
                // 데이터 구조가 예상대로인지를 확인하기 위한 로그
                console.log("Fetched favorites data:", response.data);

                // fav.touristSpot이 존재할 때만 spotId를 가져옵니다.
                const favoriteTrailIds = response.data.content
                    .filter(fav => fav.trail && fav.trail.trailId)
                    .map(fav => fav.trail.trailId);

                console.log("Favorite spots loaded:", favoriteTrailIds); // 데이터 로딩 확인용 로그
                setFavoriteTrails(favoriteTrailIds);  // 찜 목록에 있는 관광지 ID 저장
            })
            .catch(error => {
                console.error('찜 목록을 가져오는 중 오류 발생:', error);
            });
    }, [userId]);

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

        axiosInstance.get(apiUrl)
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
        fetchFavoriteTrail();
    }, [fetchTrails, fetchFavoriteTrail,userId]);

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

    const handleFavoriteToggle = (id) => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isFavorite = favoriteTrails.includes(id);

        if (isFavorite) {
            // 좋아요 삭제 요청
            axiosInstance.delete(`/api/favorites/auth/trails/${id}?email=${userId}` )
                .then(() => {
                    setFavoriteTrails((prevFavorites) => prevFavorites.filter(favId => favId !== id));
                })
                .catch(error => {
                    console.error("좋아요 삭제 중 오류:", error);
                    alert("좋아요 삭제에 실패했습니다.");
                });
        } else {
            // 좋아요 추가 요청
            axiosInstance.post(`/api/favorites/auth/trails/${id}?email=${userId}`, null, )
                .then(() => {
                    setFavoriteTrails((prevFavorites) => [...prevFavorites, id]);
                })
                .catch(error => {
                    console.error("좋아요 추가 중 오류:", error);
                    alert("좋아요 추가에 실패했습니다.");
                });
        }
    };

    return (
        <div className="container custom-container mt-5">
            {/* "결과 총 00개" */}
            <div className="page-title">둘렛길 결과 총 {trailCount}개</div>

            {/* 필터 그룹: 제목 검색, 난이도 선택, 정렬 선택 */}
            <div className="input-group filter-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="제목 검색"
                    style={{fontSize:'1.3rem'}}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleFilterChange}
                />

                <select
                    className="form-select"
                    value={difficulty}
                    style={{fontSize:'1.3rem'}}
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
                    style={{fontSize:'1.3rem'}}
                    onChange={(e) => { setSortOption(e.target.value); handleFilterChange(); }}
                >
                    <option value="">정렬 옵션 선택</option>
                    <option value="time">소요시간순</option>
                    <option value="length">소요거리순</option>
                </select>

                {/* 필터 초기화 버튼 */}
                <button className="btn btn-secondary" onClick={resetFilters} style={{fontSize:'1.3rem'}}>
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
                                        <div style={{fontSize:'1.9rem'}} className="card-title course-title">{trail.courseName}</div>
                                        <p style={{fontSize:'1.1rem'}} className="card-text course-overview">{trail.courseOverview}</p>
                                        <p className="trail-info" style={{fontSize:'1.2rem'}}>
                                            {trail.lengthInKm}km
                                            <span className="dot"></span>
                                            {Math.floor(trail.timeInMinutes / 60)}시간 {trail.timeInMinutes % 60}분
                                            <span className="dot"></span>
                                            {trail.difficulty}
                                        </p>
                                        <div className="mt-auto d-flex align-items-center"
                                             style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <i
                                                className={`bi bi-heart${favoriteTrails.includes(trail.trailId) ? '-fill heart-icon-fill' : ''} heart-icon`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFavoriteToggle(trail.trailId);
                                                }}
                                            ></i>
                                            <ReviewCount className="btn btn-primary review-btn me-2" entityType="trails"
                                                         id={trail.trailId}/>
                                        </div>
                                        {/* 평균 평점 표시 */}
                                        <AverageRating entityType="trails" entityId={trail.trailId} />
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