import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TouristSpotList.css';
import ReviewCount from "../../components/Comment/ReviewCount";
import {getUserIdFromToken } from "../../components/Util/jwtUtils";

const TouristSpotList = () => {
    const [spots, setSpots] = useState([]);
    const [spotCount, setSpotCount] = useState(0);
    const [title, setTitle] = useState("");  // 제목 필터
    const [category, setCategory] = useState("");  // 카테고리 필터
    const [region, setRegion] = useState("");  // 지역 필터
    const [indoorOutdoor, setIndoorOutdoor] = useState("");  // 실내/실외 필터
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [favoriteSpots, setFavoriteSpots] = useState([]);  // 찜한 관광지 목록
    const [userId,setUserId] = useState(null);
    const itemsPerPage = 15;
    const maxPageButtons = 5; // 페이지 버튼을 5개로 제한

    // 초기 로드 시 JWT에서 userId 설정
    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);
    }, []);

    const fetchFavoriteSpots = useCallback(() => {
        const token = sessionStorage.getItem('token');
        if (!userId || !token) return;

        axios.get(`/api/favorites/auth/tourist-spots/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page: 0,
                size: 100  // 찜 목록 크기
            }
        })
            .then(response => {
                // 데이터 구조가 예상대로인지를 확인하기 위한 로그
                console.log("Fetched favorites data:", response.data);

                // fav.touristSpot이 존재할 때만 spotId를 가져옵니다.
                const favoriteSpotIds = response.data.content
                    .filter(fav => fav.touristSpot && fav.touristSpot.spotId) // touristSpot과 spotId가 있는지 필터링
                    .map(fav => fav.touristSpot.spotId);

                console.log("Favorite spots loaded:", favoriteSpotIds); // 데이터 로딩 확인용 로그
                setFavoriteSpots(favoriteSpotIds);  // 찜 목록에 있는 관광지 ID 저장
            })
            .catch(error => {
                console.error('찜 목록을 가져오는 중 오류 발생:', error);
            });
    }, [userId]);




    // 관광지 목록 API 호출 함수
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

    // userId가 설정된 후 관광지 및 찜 목록을 불러옴
    useEffect(() => {
        if (userId) {
            fetchSpots();
            fetchFavoriteSpots();
        }
    }, [fetchSpots, fetchFavoriteSpots, userId]);

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

    const handleFavoriteToggle = (spotId) => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isFavorite = favoriteSpots.includes(spotId);

        if (isFavorite) {
            // 좋아요 삭제 요청
            axios.delete(`/api/favorites/auth/spots/${spotId}?email=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    setFavoriteSpots((prevFavorites) => prevFavorites.filter(id => id !== spotId));
                })
                .catch(error => {
                    console.error("좋아요 삭제 중 오류:", error);
                    alert("좋아요 삭제에 실패했습니다.");
                });
        } else {
            // 좋아요 추가 요청
            axios.post(`/api/favorites/auth/spots/${spotId}?email=${userId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    setFavoriteSpots((prevFavorites) => [...prevFavorites, spotId]);
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
            <div className="page-title"> 여행지 결과 총 {spotCount}개</div>

            {/* 필터 그룹 */}
            <div className="input-group filter-group mb-4" style={{height:'3rem'}}>
                {/* 제목 검색 필터 */}
                <input
                    type="text"
                    style={{fontSize:'1.3rem'}}
                    className="form-control"
                    placeholder="제목 검색"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={fetchSpots}  // 입력이 끝난 후 검색
                />

                {/* 지역 선택 필터 */}
                <select
                    className="form-select"
                    style={{fontSize:'1.3rem'}}
                    value={region}
                    onChange={(e) => { setRegion(e.target.value); setPage(0); fetchSpots(); }}
                >
                    <option value="">지역 선택</option>
                    <option value="부산">부산</option>
                    <option value="울산">울산</option>
                </select>

                {/* 실내/실외 선택 필터 */}
                <select
                    style={{fontSize:'1.3rem'}}
                    className="form-select"
                    value={indoorOutdoor}
                    onChange={(e) => { setIndoorOutdoor(e.target.value); setPage(0); fetchSpots(); }}
                >
                    <option value="">실내/실외 선택</option>
                    <option value="indoor">실내</option>
                    <option value="outdoor">실외</option>
                </select>

                {/* 필터 초기화 버튼 */}
                <button style={{fontSize:'1.3rem'}} className="btn btn-secondary ml-2" onClick={resetFilters}>초기화</button>
            </div>

            {/* 카테고리 필터 박스 */}
            <div className="category-box">
                <div style={{fontSize:'1.8rem'}} className="category-title">카테고리 필터</div>
                <div className="category-buttons mb-4">
                    {/* 카테고리 버튼 */}
                    {["공원", "문화시설", "레포츠", "테마거리", "쇼핑", "문화유산", "산책로", "해수욕장", "시장", "마을", "사찰", "체험시설", "지질공원", "테마파크", "놀이시설", "키즈카페", "전시관", "식물원", "계곡", "영화관", "아쿠아리움", "해안지역", "유적지", "상점", "도시", "공방", "스파", "명소"].map((category) => (
                        <button style={{fontSize:'1.3rem'}} key={category} className="category-btn" onClick={() => handleCategoryClick(category)}>
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* 관광지 목록 */}
            <div className="row">
                {spots.map((spot) => (
                    <div style={{marginBottom:'3rem'}} key={spot.spotId} className="col-md-4">
                        <Link to={`/tourist-spot/${spot.spotId}`} className="card-link">
                            <div className="card h-100 tourist-spot-card">
                                <img src={spot.imageUrls[0]} className="card-img-top img-fixed" alt={spot.title}/>
                                <div className="card-body d-flex flex-column">
                                    <div style={{fontSize: '1.9rem'}}
                                         className="card-title spot-list-title">{spot.title}</div>
                                    <p style={{fontSize: '1.2rem'}}
                                       className="card-text spot-overview">{spot.oneLineDesc}</p>
                                    <p style={{fontSize: '1.3rem'}} className="spot-info">
                                        {spot.address}
                                        <span className="dot"></span>
                                        {spot.region}
                                    </p>
                                    <div className="mt-auto d-flex align-items-center"
                                         style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <i
                                            className={`bi bi-heart${favoriteSpots.includes(spot.spotId) ? '-fill heart-icon-fill' : ''} heart-icon`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleFavoriteToggle(spot.spotId);
                                            }}
                                        ></i>

                                        <ReviewCount className="btn btn-primary review-btn me-2"
                                                     entityType="tourist-spots" id={spot.spotId}/>
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
