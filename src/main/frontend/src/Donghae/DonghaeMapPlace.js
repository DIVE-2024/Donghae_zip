import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import RadiusSelector from './RadiusSelector';
import './DonghaeMap.css';

const ScrollableContainer = styled.div`
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 65rem;
  height: 60rem;
  
    display: ${(props) => (props.$active ? 'block' : 'none')};

    &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.$bgColor};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.$hoverColor};
  }
`;

const Card = styled.div`
  width: 350px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  background-color: #f9f9f9;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const CardContent = styled.div`
  padding: 10px;

  h3 {
    font-size: 1.2em;
    margin-bottom: 5px;
  }

  p {
    font-size: 1.1rem;
    color: #666;
  }
`;

// 유틸리티 함수: 이미지 URL 처리
const getImageUrl = (imageUrl) => {
    try {
        if (typeof imageUrl === 'string') {
            if (imageUrl.startsWith('[') && imageUrl.endsWith(']')) {
                const images = JSON.parse(imageUrl); // JSON 문자열 파싱
                return Array.isArray(images) && images.length > 0 ? images[0] : '/image/default_image.png';
            }
            return imageUrl || '/image/default_image.png'; // 일반 문자열
        }
        if (Array.isArray(imageUrl)) {
            return imageUrl.length > 0 ? imageUrl[0] : '/image/default_image.png'; // 배열 처리
        }
        return '/image/default_image.png'; // 기본 이미지
    } catch (error) {
        console.error('Error parsing imageUrl:', error);
        return '/image/default_image.png'; // 오류 시 기본 이미지 반환
    }
};

const Pagination = ({ currentPage, totalCount, onPageChange, itemsPerPage = 4 }) => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8rem', marginTop: '1rem' }}>
            <button
                onClick={() => onPageChange(-1)}
                disabled={currentPage === 0}
            >
                이전
            </button>
            <span style={{
                alignSelf: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold'
            }}>
                {currentPage + 1} / {totalPages}
            </span>
            <button
                onClick={() => onPageChange(1)}
                disabled={(currentPage + 1) >= totalPages}
            >
                다음
            </button>
        </div>
    );
};


// 공통 렌더링 함수: 카테고리별 항목 렌더링
const renderCategoryItems = (items, category, totalCount, linkPath, radius) => (
    <div style={{ width: '45rem', marginTop: '2rem', margin: 'auto' }}>
        <p style={{ textAlign: 'center', fontSize: '2rem', marginTop: '2rem' }}>
            근처 {category} ({radius / 1000}km 반경) - 총 {totalCount}개
        </p>
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            width: '750px',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {items.map((item, index) => (
                <Card key={index}>
                    <img
                        src={getImageUrl(item.imageUrl || item.imageUrls)}
                        alt={item.name || item.title}
                        className="card-img-top"
                    />
                    <CardContent>
                        <h3>{item.name || item.title}</h3>
                        <p>{item.address || item.oneLineDesc || '정보 없음'}</p>
                        {item.averagePrice && (
                            <p>가격: {item.averagePrice.toLocaleString()} 원</p>
                        )}
                        {item.hashtag && (
                            <p>해시태그: {item.hashtag}</p>
                        )}
                        {item.placeCategory && (
                            <p>카테고리: {item.placeCategory}</p>
                        )}
                        {item.oneLineDesc && (
                            <p>{item.oneLineDesc}</p>
                        )}
                        <button
                            onClick={() => {
                                const id = item.uniqueId || item.id || item.spotId;
                                const token = sessionStorage.getItem('token'); // 세션에서 토큰 가져오기
                                const detailUrl = `${window.location.origin}${linkPath}/${id}?token=${token}`;

                                console.log("Opening URL with token:", detailUrl);

                                // 새 창 열기
                                window.open(detailUrl, "_blank", "noopener,noreferrer");
                            }}
                            className="btn btn-primary"
                            style={{
                                display: 'inline-block',
                                marginTop: '10px',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                textDecoration: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            상세 보기
                        </button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

const DonghaeMapPlace = ({
                             selectedStation,
                             accommodations,
                             restaurants,
                             touristSpots,
                             onCategoryChange, // 카테고리 변경 핸들러
                             radius,
                             setRadius,
                             showCategory,
                             hashtags,
                             totalAccommodationCount,
                             totalRestaurantCount,
                             totalTouristSpotCount,
                             onHashtagClick,
                             currentPage, // 현재 페이지 상태
                             onPageChange, // 페이지 변경 핸들러
                             onClose, // 닫기 핸들러
                         }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategorySelection = (category) => {
        const newCategory = selectedCategory === category ? null : category; // 현재 선택된 카테고리와 같으면 해제
        setSelectedCategory(newCategory); // 로컬 상태 업데이트
        onCategoryChange(newCategory); // 부모 컴포넌트(MainPage)로 변경된 카테고리 전달
    };

    return (
        <ScrollableContainer $active={!!selectedStation && showCategory}>
            {selectedStation && showCategory && (
                <>
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            padding: '1rem'
                        }}>
                            {/* 닫기 버튼 */}
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute', // 버튼을 왼쪽에 고정
                                    left: '1rem',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s ease',
                                }}
                            >
                                닫기
                            </button>

                            {/* 제목 */}
                            <h2 style={{
                                fontSize: '2.5rem',
                                textAlign: 'center',
                                margin: 0,
                            }}>
                                {selectedStation.name} 역 카테고리 선택
                            </h2>
                        </div>

                        <RadiusSelector radius={radius} setRadius={setRadius}/>
                        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center'}}>
                            <Button
                                $bgColor="#4CAF50"
                                $hoverColor="#45A049"
                                onClick={() => handleCategorySelection('accommodations')}
                                $active={selectedCategory === 'accommodations'} // 선택된 상태 시 스타일
                            >
                                숙박/휴양
                            </Button>
                            <Button
                                $bgColor="#2196F3"
                                $hoverColor="#1E88E5"
                                onClick={() => handleCategorySelection('restaurants')}
                                $active={selectedCategory === 'restaurants'}
                            >
                                식당
                            </Button>
                            <Button
                                $bgColor="#FF9800"
                                $hoverColor="#FB8C00"
                                onClick={() => handleCategorySelection('touristSpots')}
                                $active={selectedCategory === 'touristSpots'}
                            >
                                여행지
                            </Button>
                        </div>
                    </div>
                    {hashtags.length > 0 && (
                        <div>
                            <h3>해시태그</h3>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
                                {hashtags.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onHashtagClick(tag)}
                                        style={{
                                            backgroundColor: '#34a1eb',
                                            border: 'none',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedCategory === 'accommodations' && (
                        <>
                            {accommodations.length === 0 ? (
                                <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '1.5rem', color: 'red'}}>
                                    해당 반경 내 숙박시설이 없습니다.
                                </div>
                            ) : (
                                renderCategoryItems(
                                    accommodations,
                                    '숙박지',
                                    totalAccommodationCount,
                                    '/accommodation',
                                    radius
                                )
                            )}
                            <Pagination
                                currentPage={currentPage.accommodations}
                                totalCount={totalAccommodationCount}
                                onPageChange={(direction) => onPageChange('accommodations', direction)}
                            />
                        </>
                    )}

                    {selectedCategory === 'restaurants' && (
                        <>
                            {restaurants.length === 0 ? (
                                <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '1.5rem', color: 'red'}}>
                                    해당 반경 내 식당이 없습니다.
                                </div>
                            ) : (
                                renderCategoryItems(
                                    restaurants,
                                    '식당',
                                    totalRestaurantCount,
                                    '/restaurant',
                                    radius
                                )
                            )}
                            <Pagination
                                currentPage={currentPage.restaurants}
                                totalCount={totalRestaurantCount}
                                onPageChange={(direction) => onPageChange('restaurants', direction)}
                            />
                        </>
                    )}

                    {selectedCategory === 'touristSpots' && (
                        <>
                            {touristSpots.length === 0 ? (
                                <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '1.5rem', color: 'red'}}>
                                    해당 반경 내 여행지가 없습니다.
                                </div>
                            ) : (
                                renderCategoryItems(
                                    touristSpots,
                                    '여행지',
                                    totalTouristSpotCount,
                                    '/tourist-spot',
                                    radius
                                )
                            )}
                            <Pagination
                                currentPage={currentPage.touristSpots}
                                totalCount={totalTouristSpotCount}
                                onPageChange={(direction) => onPageChange('touristSpots', direction)}
                            />
                        </>
                    )}
                </>
            )}
        </ScrollableContainer>
    );
};

export default DonghaeMapPlace;
