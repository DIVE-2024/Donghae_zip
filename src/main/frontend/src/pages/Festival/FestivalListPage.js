import React, { useState, useEffect, useCallback } from 'react';
import { Card, Container, Row, Col, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import './FestivalListPage.css';
import { Link } from 'react-router-dom';
import ReviewCount from "../../components/Comment/ReviewCount";
import {getUserIdFromToken } from "../../components/Util/jwtUtils";
import AverageRating from "../../components/Comment/AverageRating";

const FestivalListPage = () => {
    const [festivals, setFestivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [region, setRegion] = useState('');
    const [status, setStatus] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [festivalsCount, setFestivalCount] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [favoriteFestivals, setFavoriteFestivals] = useState([]); // 사용자의 찜 목록
    const [userId,setUserId] = useState(null);
    const itemsPerPage = 15; // 한 페이지에 15개의 식당

    // 초기 로드 시 JWT에서 userId 설정
    useEffect(() => {
        const userId = getUserIdFromToken();  // userId 가져오기
        if (userId) setUserId(userId);
    }, []);

    // 사용자 찜 목록 가져오기
    const fetchFavoriteFestivals = useCallback(() => {
        const token = sessionStorage.getItem('token');
        const userId = getUserIdFromToken();
        console.log(userId);

        if (!userId) {
            console.error('userId가 세션에 저장되지 않았습니다.');
            return;
        }

        axios.get(`/api/favorites/auth/festivals/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page: page,  // 페이지 번호 추가
                size: itemsPerPage  // 페이지 크기 추가
            }
        })
            .then(response => {
                // 데이터 구조가 예상대로인지를 확인하기 위한 로그
                console.log("Fetched favorites data:", response.data);

                const favoriteFestivalsIds = response.data.content.map(fav => fav.festival.festivalId);
                setFavoriteFestivals(favoriteFestivalsIds); // 찜 목록 상태에 저장
                setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
                setFestivalCount(response.data.totalElements); // 전체 식당 수 설정
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching favorite restaurants:', error);
                setLoading(false);
            });
    }, [page]);

    const fetchFestivals = useCallback(async () => {
        try {
            let filterUrl = `/api/festivals/filter?page=${page}&size=${itemsPerPage}`;

            // 제목으로 필터링
            if (title) {
                filterUrl = `/api/festivals/search/title?title=${encodeURIComponent(title)}&page=${page}&size=${itemsPerPage}`;
            }
            // 지역으로 필터링
            else if (region) {
                filterUrl = `/api/festivals/search/region?region=${encodeURIComponent(region)}&page=${page}&size=${itemsPerPage}`;
            }
            // 상태로 필터링 (예정, 진행 중, 완료)
            else if (status) {
                filterUrl = `/api/festivals/status?status=${status}&page=${page}&size=${itemsPerPage}`;
            }
            // 년도/월로 필터링
            else if (year && month) {
                filterUrl = `/api/festivals/search/year-month?year=${year}&month=${month}&page=${page}&size=${itemsPerPage}`;
            }

            // 필터가 없는 경우 기본 데이터 가져오기
            const response = await axios.get(filterUrl);
            console.log(response.data); // 콘솔 로그로 필터링된 데이터 확인
            setFestivals(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching festivals', error);
        }
    }, [page, itemsPerPage, title, region, status, year, month]);

    useEffect(() => {
        fetchFestivals();
        fetchFavoriteFestivals();
    }, [fetchFestivals]);

    const handleFilterChange = () => {
        setPage(0); // 필터가 변경될 때 페이지를 처음으로 리셋
        fetchFestivals(); // 필터 변경 시 필터된 데이터를 다시 가져옴
    };

    const handleReset = () => {
        setTitle('');
        setRegion('');
        setStatus('');
        setYear('');
        setMonth('');
        setPage(0);
        fetchFestivals();
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber - 1);
    };

    const handleFavoriteToggle = (id) => {
        const token = sessionStorage.getItem('token');
        if (!token || !userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isFavorite = favoriteFestivals.includes(id);

        if (isFavorite) {
            // 좋아요 삭제 요청
            axios.delete(`/api/favorites/auth/festivals/${id}?email=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    // 기존 코드에서 삭제할 id를 명확히 지정하여 상태를 업데이트합니다
                    setFavoriteFestivals((prevFavorites) => prevFavorites.filter(favId => favId !== id));
                })
                .catch(error => {
                    console.error("좋아요 삭제 중 오류:", error);
                    alert("좋아요 삭제에 실패했습니다.");
                });
        } else {
            // 좋아요 추가 요청
            axios.post(`/api/favorites/auth/festivals/${id}?email=${userId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    setFavoriteFestivals((prevFavorites) => [...prevFavorites, id]);
                })
                .catch(error => {
                    console.error("좋아요 추가 중 오류:", error);
                    alert("좋아요 추가에 실패했습니다.");
                });
        }
    };

    return (
        <div className="container custom-container mt-5">
            <div className="page-title">축제 결과 총 {totalElements}개</div>

            {/* 필터 그룹: 제목 검색, 지역 선택, 상태 선택, 년도 선택, 월 선택 */}
            <div className="input-group festival-filter-group mb-4" style={{margin:'auto'}}>
                {/* 제목 검색 */}
                <input
                    type="text"
                    className="form-control"
                    placeholder="제목 검색"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleFilterChange} // 필터 값 변경 시 처리
                />

                {/* 지역 선택 */}
                <select
                    className="form-select"
                    value={region}
                    onChange={(e) => {
                        setRegion(e.target.value);
                        handleFilterChange();
                    }}
                >
                    <option value="">지역 선택</option>
                    <option value="울산">울산</option>
                    <option value="부산">부산</option>
                    {/* 다른 지역 옵션 추가 */}
                </select>

                {/* 상태 선택 */}
                <select
                    className="form-select"
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        handleFilterChange();
                    }}
                >
                    <option value="">상태 선택</option>
                    <option value="PENDING">예정</option>
                    <option value="ONGOING">진행 중</option>
                    <option value="COMPLETED">완료</option>
                </select>

                {/* 년도 선택 */}
                <input
                    type="number"
                    className="form-control"
                    placeholder="년도 선택"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    onBlur={handleFilterChange} // 필터 값 변경 시 처리
                />

                {/* 월 선택 */}
                <select
                    className="form-select"
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        handleFilterChange();
                    }}
                >
                    <option value="">월 선택</option>
                    <option value="1">1월</option>
                    <option value="2">2월</option>
                    <option value="3">3월</option>
                    <option value="4">4월</option>
                    <option value="5">5월</option>
                    <option value="6">6월</option>
                    <option value="7">7월</option>
                    <option value="8">8월</option>
                    <option value="9">9월</option>
                    <option value="10">10월</option>
                    <option value="11">11월</option>
                    <option value="12">12월</option>
                </select>

                {/* 초기화 버튼 */}
                <button className="btn btn-secondary" onClick={handleReset}>
                    초기화
                </button>
            </div>

            <Row className="mt-4">
                {festivals.map((festival) => (
                    <Col key={festival.festivalId} md={4} className="mb-4">
                        <Card className="festival-card">
                            <Link to={`/festival/${festival.festivalId}`}> {/* 각 카드를 클릭하면 해당 상세 페이지로 이동 */}
                                <Card.Img className="festival-card-img" variant="top"
                                          src={festival.images[0] || 'default-image-url'}/>
                            </Link>
                            <Card.Body>
                                <Card.Title className="festival-card-title" style={{fontSize:'1.9rem'}}>{festival.title}</Card.Title>
                                <Card.Text className="festival-card-text" style={{fontSize:'1.3rem'}}>{festival.period}</Card.Text>
                                <div className="mt-auto d-flex align-items-center"
                                     style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <i
                                        className={`bi bi-heart${favoriteFestivals.includes(festival.festivalId) ? '-fill heart-icon-fill' : ''} heart-icon`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFavoriteToggle(festival.festivalId);
                                        }}
                                    ></i>
                                    <ReviewCount className="btn btn-primary review-btn me-2" entityType="festivals"
                                                 id={festival.festivalId}/>
                                </div>
                                {/* 평균 평점 표시 */}
                                <AverageRating entityType="festivals" entityId={festival.festivalId} />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                <Col md={12}>
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            onClick={() => handlePageChange(page > 0 ? page : 1)}
                            disabled={page === 0}
                        >
                        이전
                        </Pagination.Prev>
                        {[...Array(Math.min(5, totalPages))].map((_, idx) => (
                            <Pagination.Item
                                key={idx}
                                active={idx === page}
                                onClick={() => handlePageChange(idx + 1)}
                            >
                                {idx + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(page < totalPages - 1 ? page + 2 : totalPages)}
                            disabled={page >= totalPages - 1}
                        >
                            다음
                        </Pagination.Next>
                    </Pagination>
                </Col>
            </Row>
        </div>
    );
};

export default FestivalListPage;