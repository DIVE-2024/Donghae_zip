import React, {memo, useEffect, useState} from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-bootstrap';
import axios from "axios";
import donghaeLineImage from '../../assets/images/Donghae_Line.png';
import oceanImage from '../../assets/images/ocean.png'; // 이미지 가져오기
import DonghaeMap from '../../Donghae/DonghaeMap';
import DonghaeMapPlace from '../../Donghae/DonghaeMapPlace';
import StationStatsChart from "../../Chart/StationStatsChart";


const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #edf2f7;
  min-height: 100vh;
`;

// React.memo를 사용하여 TopSection이 캐러셀 상태 변화와 관계없이 렌더링되지 않도록 함
const TopSection = memo(styled.div`
  box-sizing: border-box;
  height: 60rem;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
`);

const TextSection = styled.div`
  width: 110rem;
  padding-right: 20px;
  padding-top: 150px;
  color: white;
  margin-right: 50px;
  margin-left: 70px;
`;

const Heading3 = styled.h3`
  text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.8);
  margin-bottom: 1rem;
`;

const Heading1 = styled.h1`
  text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
  font-size: 3.5rem;
  margin-bottom: 10px;
  font-weight: normal;
`;

const Paragraph = styled.p`
  text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
  font-size: 1.5rem;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

const InputGroup = styled.div`
  width: 35rem;
  height: 4rem;
`;

const FormControl = styled.input`
  width: 80%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
  font-size: 1.5rem;
`;

const ButtonPrimary = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

// 이미지 섹션 전체 스타일
const ImageSection = styled.div`
  width: 120%;
  max-width: 60rem;
  margin: auto;
    height: 60rem;
  padding: 1rem;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
`;

// 캐러셀 아이템 스타일
const CarouselItemWrapper = styled.div`
  width: 100%;
  height: 58rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  overflow: hidden;  /* 이미지가 넘어가지 않도록 설정 */
`;

// 캐러셀 아이템 내 이미지 스타일
const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;  /* 이미지 비율을 유지하면서 크기에 맞춤 */
`;

const BottomSection = styled.div`
  padding: 10px;
  background-color: #b4c2d7;
`;

const HalfSection = styled.div`
  flex: 1;
  padding: 20px;
  margin: 0 10px;
  background-color: #cbd5e0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// 이전/다음 버튼 커스터마이징
const CarouselControlPrevIcon = styled.span`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-size: 70%;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  &::before {
    font-size: 2rem;
    color: white;
  }
`;

const CarouselControlNextIcon = styled.span`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-size: 70%;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  &::before {
    font-size: 2rem;
    color: white;
  }
`;

const CarouselControlPrev = styled.a`
  width: 9%;
`;

const CarouselControlNext = styled.a`
  width: 9%;
`;

const MainPage = () => {
    const [stationsData, setStationsData] = useState([]);
    const [ongoingFestivals, setOngoingFestivals] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null); // 선택된 역 상태 관리
    const [showCategory, setShowCategory] = useState(false); // 카테고리 UI 표시 상태 관리
    const [radius, setRadius] = useState(1500); // 반경 기본값 설정
    const [accommodations, setAccommodations] = useState([]);  // 숙박 데이터
    const [restaurants, setRestaurants] = useState([]);  // 식당 데이터
    const [touristSpots, setTouristSpots] = useState([]);  // 여행지 데이터
    const [isStationClicked, setIsStationClicked] = useState(false); // 역 클릭 여부 상태


    // 역 클릭 시 처리 로직
    const handleStationClick = (stationName) => {
        axios.get(`/api/donghae/station/${stationName}`)
            .then((response) => {
                const { stationInfo } = response.data;
                setSelectedStation({
                    name: stationInfo.stationName,
                    latitude: stationInfo.latitude,
                    longitude: stationInfo.longitude
                });
                setShowCategory(true); // 카테고리 UI 표시
                setIsStationClicked(true);  // 역 클릭 상태 업데이트
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    };



    // 동해선 역 데이터 및 진행 중인 축제 데이터를 API에서 가져오는 로직
    useEffect(() => {
        // 동해선 역 데이터 가져오기
        axios.get("/api/donghae/donghae-line")
            .then(response => {
                const filteredStations = response.data.filter(station => station.lineName === "동해선");
                setStationsData(filteredStations);
            })
            .catch(error => {
                console.error("Error fetching station data:", error);
            });

        // 진행 중인 축제 데이터 가져오기
        axios.get("/api/festivals/status", {
            params: {
                status: 'ONGOING',  // 진행 중인 축제만 필터링
                page: 0,
                size: 10  // 한 번에 최대 10개의 축제를 가져옴
            }
        })
            .then(response => {
                setOngoingFestivals(response.data.content);  // 축제 데이터를 설정 (페이지네이션의 content 배열)
            })
            .catch(error => {
                console.error("Error fetching ongoing festival data:", error);
            });
    }, []);  // 빈 배열 []로 설정하여 최초 렌더링 시 한 번만 실행

    return (
        <MainContainer>
            {/* 상단 메인 섹션 */}
            <TopSection $backgroundImage={oceanImage}>
                <div style={{display: 'flex', justifyContent: 'center', margin: 'auto'}}>
                    <TextSection>
                        <img src={donghaeLineImage} alt="Donghae Line" style={{ width: '100px', height: '100px', marginBottom: '2rem' }} />
                        <Heading3>부산 대표 광역 전철 '동해선'</Heading3>
                        <Heading1>동해선 주위의 모든 여행지에 대한</Heading1>
                        <Heading1>계획을 세우세요!</Heading1>
                        <Paragraph>부산부터 울산까지 코레일의 광역 전철 ‘동해선’ 주위의 모든 관광지, 먹거리, 축제/행사 등의 정보를 이곳 “Donghae.zip”에서 제공합니다.</Paragraph>
                        <SearchBar>
                            <InputGroup>
                                <FormControl type="text" placeholder="여행지를 검색하세요..." aria-label="Search" />
                                <ButtonPrimary type="button">검색</ButtonPrimary>
                            </InputGroup>
                        </SearchBar>
                    </TextSection>
                    {/* 캐러셀 섹션 */}
                    <ImageSection>
                        <Carousel prevIcon={<CarouselControlPrev><CarouselControlPrevIcon /></CarouselControlPrev>}
                                  nextIcon={<CarouselControlNext><CarouselControlNextIcon /></CarouselControlNext>}>
                            {ongoingFestivals.map((festival, index) => (
                                <Carousel.Item key={festival.id || index}>
                                    <CarouselItemWrapper>
                                        <CarouselImage src={festival.images?.[0] || 'path/to/default_image.png'} alt={festival.title} />
                                    </CarouselItemWrapper>
                                    <Carousel.Caption style={{ fontSize: '1.5rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
                                        <h3>{festival.title}</h3>
                                        <p>{festival.period}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </ImageSection>
                </div>
            </TopSection>

            {/* 하단 추가 섹션 */}
            <BottomSection>
                <p style={{fontSize: '3rem'}}>동해선 역을 클릭해 보세요!</p>
                <div style={{display:'flex',gap:'5rem',justifyContent:'center'}}>
                    {/* DonghaeMap 표시 */}
                    <DonghaeMap
                        stations={stationsData}
                        accommodations={accommodations}
                        restaurants={restaurants}
                        touristSpots={touristSpots}
                        onStationClick={handleStationClick}
                        radius={radius}
                        selectedStation={selectedStation}
                    />
                    {/* 역 클릭 전에는 StationStatsChart를, 클릭 후에는 DonghaeMapPlace를 표시 */}
                    {!isStationClicked ? (
                        <StationStatsChart />
                        ) : (
                        <DonghaeMapPlace />
                        )}
                </div>

            </BottomSection>
        </MainContainer>
    );
};

export default MainPage;
