import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DonghaeMap from './DonghaeMap';
import './MapList.css';
import { Link } from 'react-router-dom';  // CSS 파일 임포트
import './DonghaeMap.css';


const DonghaeMapPlace = () => {
    const [stations, setStations] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [touristSpots, setTouristSpots] = useState([]);  // 여행지 상태 추가
    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [showCategory, setShowCategory] = useState(false);
    const [showAccommodations, setShowAccommodations] = useState(false);
    const [showRestaurants, setShowRestaurants] = useState(false);
    const [showTouristSpots, setShowTouristSpots] = useState(false);  // 여행지 표시 상태
    const [totalAccommodationCount, setTotalAccommodationCount] = useState(0);
    const [totalRestaurantCount, setTotalRestaurantCount] = useState(0);
    const [totalTouristSpotCount, setTotalTouristSpotCount] = useState(0);  // 여행지 총 개수 상태 추가
    const [hashtags, setHashtags] = useState([]);  // 해시태그 상태 추가
    const [touristCategories, setTouristCategories] = useState([]);  // 여행지 카테고리 상태 추가
    const [selectedHashtag, setSelectedHashtag] = useState(null);  // 선택된 해시태그 상태 추가
    const [selectedCategory, setSelectedCategory] = useState(null);  // 선택된 카테고리 상태 추가
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(4);
    const [radius, setRadius] = useState(1500); // 기본값 1.5km로 설정


    const handleRadiusChange = (e) => {
        const selectedRadius = e.target.value;
        console.log(selectedRadius);
        setRadius(selectedRadius); // 선택된 반경 값 업데이트

        // 반경이 바뀌면 새로운 반경 값을 가지고 백엔드 API 요청
        if (selectedStation) {
            const { latitude, longitude } = selectedStation;

            // 여행지 데이터 요청
            axios.get(`/api/tourist-spots/radius`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: selectedRadius,  // 선택된 반경 값으로 백엔드 요청
                    page: currentPage,
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
                .then((response) => {
                    setTouristSpots(response.data.content);
                    setTotalTouristSpotCount(response.data.totalElements);  // 총 개수 업데이트
                })
                .catch((error) => {
                    console.error("Error fetching tourist spots data:", error);
                });

            // 카테고리 데이터 요청
            axios.get(`/api/tourist-spots/radius/categories`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: selectedRadius  // 선택된 반경 값으로 백엔드 요청
                }
            })
                .then((res) => {
                    setTouristCategories(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching categories:", err);
                });
            // 숙박 데이터 요청
            axios.get(`/api/accommodations/radius`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: selectedRadius,  // 선택된 반경 값으로 백엔드 요청
                    page: currentPage,
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
                .then((response) => {
                    setAccommodations(response.data.content);
                    setTotalAccommodationCount(response.data.totalElements);  // 총 개수 업데이트
                })
                .catch((error) => {
                    console.error("Error fetching accommodation data:", error);
                });

            // 식당 데이터 요청
            axios.get(`/api/restaurants/radius`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: selectedRadius,  // 선택된 반경 값으로 백엔드 요청
                    page: currentPage,
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
                .then((response) => {
                    setRestaurants(response.data.content);
                    setTotalRestaurantCount(response.data.totalElements);  // 총 개수 업데이트
                })
                .catch((error) => {
                    console.error("Error fetching restaurant data:", error);
                });
        }
    };



    // 초기 동해선 역 정보 불러오기
    useEffect(() => {
        axios.get("/api/donghae/donghae-line")
            .then((response) => {
                const filteredStations = response.data.filter(station => station.lineName === "동해선");
                setStations(filteredStations);
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    }, []);

    const handleStationClick = (stationName) => {
        // 새로운 역을 클릭할 때 이전 상태 초기화
        setAccommodations([]);
        setRestaurants([]);
        setShowAccommodations(false);
        setShowRestaurants(false);
        setSelectedAccommodation(null);
        setHashtags([]);  // 해시태그 초기화
        setShowCategory(false); // 카테고리 메뉴 숨기기

        const scrollableContainer = document.querySelector('.scrollable-container');
        if (scrollableContainer) {
            scrollableContainer.classList.add('active');  // active 클래스 추가
        }

        // 새로운 역에 대한 정보를 가져옴
        axios.get(`/api/donghae/station/${stationName}`)
    .then((response) => {
            const { stationInfo } = response.data;
            setSelectedStation({
                name: stationInfo.stationName,
                latitude: stationInfo.latitude,
                longitude: stationInfo.longitude
            });
            setShowCategory(true); // 새로운 역에 대해 카테고리 메뉴 표시
        })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    };


    const handleAccommodationClick = (page = 0, toggle = true) => {
        console.log(page);
        if (selectedStation) {
            const { latitude, longitude } = selectedStation;

            axios.get(`/api/accommodations/radius`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius,
                    page: page,
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
        .then((response) => {
                setAccommodations(response.data.content);
                setTotalAccommodationCount(response.data.totalElements);
                setCurrentPage(page);
                if (toggle) {
                    setShowAccommodations(!showAccommodations); // 상태 토글을 옵션으로 처리
                }
            })
                .catch((error) => {
                    console.error("Error fetching accommodation data:", error);
                });
        }
    };

    const handleRestaurantClick = (page = 0, toggle = true) => {
        console.log(page);
        if (selectedStation) {
            const { latitude, longitude } = selectedStation;

            axios.get(`/api/restaurants/radius`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius,
                    page: page,
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
        .then((response) => {
                setRestaurants(response.data.content);
                setTotalRestaurantCount(response.data.totalElements);
                setCurrentPage(page);
                if (toggle) {
                    setShowRestaurants(!showRestaurants); // 상태 토글을 옵션으로 처리
                }
            })
                .catch((error) => {
                    console.error("Error fetching restaurant data:", error);
                });

            // 해시태그 불러오기
            axios.get(`/api/restaurants/radius/hashtags`, {
                params: { latitude, longitude, radius }
            })
        .then((response) => {
                setHashtags(response.data);  // 해시태그 상태 업데이트
            })
                .catch((error) => {
                    console.error("Error fetching hashtags:", error);
                });
        }
    };

    // 여행지 버튼을 클릭하면 해당 목록을 토글
    const handleTouristSpotClick = (page = 0, toggle = true) => {
        if (selectedStation) {
            const { latitude, longitude } = selectedStation;

            axios.get(`/api/tourist-spots/radius`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius,
                    page: page,
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
        .then((response) => {
                setTouristSpots(response.data.content);
                setTotalTouristSpotCount(response.data.totalElements);
                setCurrentPage(page);
                if (toggle) {
                    setShowTouristSpots(!showTouristSpots);  // 상태를 토글하여 목록을 활성화/비활성화
                }

                // 카테고리 목록 불러오기
                axios.get(`/api/tourist-spots/radius/categories`, {
                    params: {
                        latitude: latitude,
                        longitude: longitude,
                        radius: radius
                    }
                }).then((res) => {
                    setTouristCategories(res.data);
                }).catch((err) => {
                    console.error("Error fetching categories:", err);
                });
            })
                .catch((error) => {
                    console.error("Error fetching tourist spots data:", error);
                });
        }
    };


    const handleCategoryClick = (category = selectedCategory, page = 0) => {
        console.log("Selected category:", category);
        const { latitude, longitude } = selectedStation;

        const params = {
            latitude: latitude,
            longitude: longitude,
            radius: radius,
            placeCategory: category,
            page: page,
            size: pageSize
        };

        console.log("API Request Params:", params); // API 요청 파라미터 확인

        axios.get(`/api/tourist-spots/radius/filter`, { params })
    .then((response) => {
            setTouristSpots(response.data.content);
            setTotalTouristSpotCount(response.data.totalElements);
            setSelectedCategory(category);  // 선택된 카테고리 업데이트
            setCurrentPage(page);
        })
            .catch((error) => {
                console.error("Error fetching filtered tourist spots:", error);
            });
    };


    // 해시태그 클릭 시 해당 해시태그에 속하는 식당들만 보여줌
    const handleHashtagClick = (hashtag, page = 0) => {
        if (selectedStation) {
            const { latitude, longitude } = selectedStation;

            // 해시태그 선택 상태 업데이트
            setSelectedHashtag(hashtag);

            axios.get(`/api/restaurants/radius/hashtag`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius,
                    hashtag: hashtag,
                    page: page,  // 페이지 번호 전달
                    size: pageSize,
                    sort: 'name,asc'
                }
            })
        .then((response) => {
                setRestaurants(response.data.content);
                setTotalRestaurantCount(response.data.totalElements);  // 총 개수 업데이트
                setCurrentPage(page);  // 페이지 상태 업데이트
            })
                .catch((error) => {
                    console.error("Error fetching restaurant data by hashtag:", error);
                });
        }
    };

    const handleAccommodationSelect = (accommodation) => {
        setSelectedAccommodation(accommodation); // 선택된 숙박시설 저장
    };

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>  {/* 부모 요소에 flex row 적용 */}
            <DonghaeMap
                stations={stations}
                accommodations={showAccommodations ? accommodations : []}
                restaurants={showRestaurants ? restaurants : []}
                touristSpots={showTouristSpots ? touristSpots : []}  // 여행지 전달
                onStationClick={handleStationClick}  // 클릭 이벤트 핸들러 연결
            />

            {/* 전체 목록을 감싸는 스크롤 가능한 컨테이너 */}
            <div className={`scrollable-container ${selectedStation && showCategory ? 'active' : ''}`}
                 style={{marginLeft: '10rem', height: '60rem'}}>

                {selectedStation && showCategory && (
                    <div>
                        <p style={{fontSize: '2.5rem'}}>{selectedStation.name}역 카테고리 선택</p>
                        {/* 반경 선택 UI를 카테고리 버튼들 바로 아래에 위치 */}
                        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center'}}>
                            <label style={{fontSize:'1.5rem'}}>반경 선택:</label>
                            <select value={radius} onChange={handleRadiusChange}>
                                <option value={1000}>1km</option>
                                <option value={1500}>1.5km</option>
                                <option value={2000}>2km</option>
                                <option value={3000}>3km</option>
                            </select>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center'}}>
                            <button
                                onClick={() => handleAccommodationClick(0)}
                                style={{
                                    backgroundColor: '#4CAF50',  // 차분한 그린 계열 색상
                                    color: 'white',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#45A049'}  // hover 효과
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                            >
                                {showAccommodations ? '목록 접기' : '숙박/휴양'}
                            </button>

                            <button
                                onClick={() => handleRestaurantClick(0)}
                                style={{
                                    backgroundColor: '#2196F3',  // 시원한 블루 계열 색상
                                    color: 'white',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#1E88E5'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
                            >
                                {showRestaurants ? '목록 접기' : '식당'}
                            </button>

                            <button
                                onClick={() => handleTouristSpotClick(0)}
                                style={{
                                    backgroundColor: '#FF9800',  // 따뜻한 오렌지 색상
                                    color: 'white',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#FB8C00'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF9800'}
                            >
                                {showTouristSpots ? '목록 접기' : '여행지'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 해시태그 필터링 */}
                {showRestaurants && hashtags.length > 0 && (
                    <div style={{marginTop: '1rem'}}>
                        <h3>해시태그</h3>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
                            {hashtags.map((hashtag, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleHashtagClick(hashtag)}
                                    style={{
                                        backgroundColor: '#34a1eb',  // 하늘색
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#00BFFF'}  // hover 효과
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#34a1eb'}
                                >
                                    {hashtag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 숙박시설 리스트 */}
                {showAccommodations && accommodations.length > 0 && (
                    <div style={{width: '40rem', marginTop: '2rem'}}>
                        <p style={{textAlign: 'center', width: '1100px', fontSize: '2rem'}}>근처 숙박시설 ({radius / 1000}km 반경)
                            총 {totalAccommodationCount}개</p>
                        <div style={{
                            marginLeft: '14rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            width: '750px',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {accommodations.map((accommodation, index) => (
                                <div className="card" key={index} style={{width: '350px'}}
                                     onClick={() => handleAccommodationSelect(accommodation)}>
                                    <img src={accommodation.imageUrl} alt={accommodation.name}/>
                                    <div className="card-content">
                                        <h3>{accommodation.name}</h3>
                                        <p>주소: {accommodation.address}</p>
                                        <p>가격: {accommodation.averagePrice} 원</p>
                                        <Link to={`/accommodation/${accommodation.uniqueId}`}
                                              className="btn btn-primary">
                                            상세 보기
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            <div className="paging-container">
                                {currentPage > 0 && (
                                    <button className="paging-button"
                                            onClick={() => handleAccommodationClick(currentPage - 1, false)}>이전</button>
                                )}
                                {restaurants.length === pageSize && (
                                    <button className="paging-button"
                                            onClick={() => handleAccommodationClick(currentPage + 1, false)}>다음</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 식당 리스트 */}
                {showRestaurants && restaurants.length > 0 && (
                    <div style={{width: '40rem', marginTop: '2rem'}}>
                        <p style={{textAlign: 'center', width: '1100px', fontSize: '2rem'}}>근처 식당 ({radius / 1000}km 반경)
                            총 {totalRestaurantCount}개</p>
                        <div style={{
                            marginLeft: '14rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            width: '750px',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {restaurants.map((restaurant, index) => (
                                <div className="card" key={index} style={{width: '350px'}}>
                                    <img
                                        src={
                                            restaurant.imageUrl && JSON.parse(restaurant.imageUrl).length > 0
                                                ? JSON.parse(restaurant.imageUrl)[0]
                                                : '/image/default_image.png'
                                        }
                                        className="card-img-top"
                                        alt={restaurant.name}
                                    />
                                    <div className="card-content">
                                        <h3>{restaurant.name}</h3>
                                        <p>주소: {restaurant.address}</p>
                                        <p>해시태그: {restaurant.hashtag}</p>
                                        <Link to={`/restaurant/${restaurant.id}`} className="btn btn-primary">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="paging-container">
                            {currentPage > 0 && (
                                <button className="paging-button"
                                        onClick={() => handleRestaurantClick(currentPage - 1, false)}>이전</button>
                            )}
                            {restaurants.length === pageSize && (
                                <button className="paging-button"
                                        onClick={() => handleRestaurantClick(currentPage + 1, false)}>다음</button>
                            )}
                        </div>
                    </div>
                )}

                {/* 여행지 리스트 */}
                {showTouristSpots && touristSpots.length > 0 && (
                    <div style={{width: '40rem', marginTop: '2rem'}}>
                        <p style={{textAlign: 'center', width: '1100px', fontSize: '2rem'}}>카테고리 필터</p>
                        {touristCategories.length > 0 && (
                            <div style={{marginBottom: '1rem', gap: '5px'}}>
                                <h3 style={{textAlign: 'center', width: '1100px'}}>근처 여행지 ({radius / 1000}km 반경) -
                                    총 {totalTouristSpotCount}개</h3>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    justifyContent: 'center',
                                    width: '1100px'
                                }}>
                                    {touristCategories.map((category, index) => (
                                        <button key={index} onClick={() => handleCategoryClick(category)}
                                                style={{
                                                    backgroundColor: '#34a1eb',  // 하늘색
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    transition: 'background-color 0.3s ease',
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#00BFFF'}  // hover 효과
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#34a1eb'}
                                        >{category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div style={{
                            marginLeft: '14rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            width: '750px',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {touristSpots.map((spot, index) => (
                                <div className="card" key={index} style={{width: '350px'}}>
                                    <img
                                        src={spot.imageUrls && spot.imageUrls.length > 0 ? spot.imageUrls[0] : '/image/default_image.png'}
                                        alt={spot.title}
                                    />
                                    <div className="card-content">
                                        <h3>{spot.title}</h3>
                                        <p>{spot.oneLineDesc}</p>
                                        <p>카테고리: {spot.placeCategory}</p>
                                        <Link to={`/tourist-spot/${spot.spotId}`} className="btn btn-primary">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="paging-container">
                            {currentPage > 0 && (
                                <button
                                    className="paging-button"
                                    onClick={() => handleTouristSpotClick(currentPage - 1, false)}
                                >
                                    이전
                                </button>
                            )}
                            {touristSpots.length === pageSize && (
                                <button
                                    className="paging-button"
                                    onClick={() => handleTouristSpotClick(currentPage + 1, false)}
                                >
                                    다음
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonghaeMapPlace;