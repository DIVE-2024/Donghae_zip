import React, { useState, useEffect, useCallback } from 'react';
import { Card, Container, Row, Col, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import './FestivalListPage.css';
import { Link } from 'react-router-dom';

const FestivalListPage = () => {
    const [festivals, setFestivals] = useState([]);
    const [title, setTitle] = useState('');
    const [region, setRegion] = useState('');
    const [status, setStatus] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const size = 15;

    const fetchFestivals = useCallback(async () => {
        try {
            let filterUrl = `/api/festivals/filter?page=${page}&size=${size}`;

            // 제목으로 필터링
            if (title) {
                filterUrl = `/api/festivals/search/title?title=${encodeURIComponent(title)}&page=${page}&size=${size}`;
            }
            // 지역으로 필터링
            else if (region) {
                filterUrl = `/api/festivals/search/region?region=${encodeURIComponent(region)}&page=${page}&size=${size}`;
            }
            // 상태로 필터링 (예정, 진행 중, 완료)
            else if (status) {
                filterUrl = `/api/festivals/status?status=${status}&page=${page}&size=${size}`;
            }
            // 년도/월로 필터링
            else if (year && month) {
                filterUrl = `/api/festivals/search/year-month?year=${year}&month=${month}&page=${page}&size=${size}`;
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
    }, [page, size, title, region, status, year, month]);

    useEffect(() => {
        fetchFestivals();
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

    return (
        <Container className="festival-list-page">
            <h1 className="festival-count">결과 총 {totalElements}개</h1>

            {/* 필터 그룹: 제목 검색, 지역 선택, 상태 선택, 년도 선택, 월 선택 */}
            <div className="input-group festival-filter-group mb-4">
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
                    onChange={(e) => { setRegion(e.target.value); handleFilterChange(); }}
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
                    onChange={(e) => { setStatus(e.target.value); handleFilterChange(); }}
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
                    onChange={(e) => { setMonth(e.target.value); handleFilterChange(); }}
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
                                    <Card.Img className="festival-card-img" variant="top" src={festival.images[0] || 'default-image-url'} />
                                </Link>
                            <Card.Body>
                                <Card.Title className="festival-card-title">{festival.title}</Card.Title>
                                <Card.Text className="festival-card-text">{festival.period}</Card.Text>
                                <div className="card-bottom-right">
                                    <Button className="festival-review-btn">리뷰 {festival.reviewCount || 0}개</Button>
                                    <Button variant="outline-danger" className="heart-btn">
                                        <i className="bi bi-heart"></i>
                                    </Button>
                                </div>
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
        </Container>
    );
};

export default FestivalListPage;