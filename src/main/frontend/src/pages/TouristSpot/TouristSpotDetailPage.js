import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TouristSpotDetailPage.css';
import Map from '../../components/Map/Map';

const TouristSpotDetailPage = () => {
    const { spotId } = useParams();
    const [spot, setSpot] = useState(null);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        // spotId를 사용하여 API 호출
        axios.get(`/api/tourist-spots/${spotId}`)
            .then(response => {
                setSpot(response.data);
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching tourist spot data:', error);
            });

        // 태그 데이터를 가져오는 API 호출
        axios.get(`/api/tourist-spots/${spotId}/tags`)
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
            });
    }, [spotId]);

    if (!spot) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{backgroundColor:'white',borderRadius:'5rem',width:'90%',padding:'2rem',margin:'auto',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
        <div className="tourist-spot-detail-container mt-5">
            {/* 여행지 제목 */}
            <div style={{fontSize:'4rem'}} className="text-center">{spot.title}</div>

            {/* 별점 표시 */}
            <div className="text-center mb-2">
                {[...Array(4)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill text-warning"></i>
                ))}
                <i className="bi bi-star text-secondary"></i>
            </div>

            {/* tags 표시 */}
            <div className="text-center mb-4">
                {spot.tags && spot.tags.length > 0 && spot.tags.map((tag, idx) => (
                    <span style={{height: '3rem', fontSize: '1.5rem', padding: '10px', textAlign: 'center'}} key={idx}
                          className="badge bg-secondary me-2">{tag}</span>
                ))}
            </div>

            <div className="tour-detail" style={{display:'flex', justifyContent: 'center'}}>
                {/* 이미지 Carousel */}
                <div style={{width: '100%', maxWidth: '80rem'}}>
                    <Carousel className="carousel-center mb-4" style={{overflow: 'hidden', borderRadius: '20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'}}>
                        {spot.imageUrls && spot.imageUrls.map((image, idx) => (
                            <Carousel.Item key={idx} style={{
                                borderRadius: '20px',  /* Carousel.Item에도 border-radius를 명확히 적용 */
                                overflow: 'hidden'   /* overflow를 명확하게 설정 */
                            }}>
                                <img
                                    className="d-block w-100 spot-image"
                                    src={image}
                                    alt={`Tourist Spot ${idx + 1}`}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: '20px'
                                    }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>


            {/* 여행지 정보 */}
            <div style={{display: 'flex',marginLeft:'15rem',gap:'8rem'}}>
                <div style={{display:'flex',justifyContent:'center'}}>
                    <div className="spot-info-section" style={{
                        marginTop: '2rem',
                        marginBottom: '2rem',
                        maxWidth: '1000px',
                        lineHeight: '1.6',
                        textAlign: 'left'
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>여행지 정보
                        </div>

                        <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}><strong>여행지:</strong> {spot.title}</p>
                        <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}><strong>카테고리:</strong> {spot.placeCategory}
                        </p>
                        <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}><strong>설명:</strong> {spot.oneLineDesc}</p>

                        {/* Contact Info */}
                        {spot.contactInfo && Object.keys(spot.contactInfo).map((key, idx) => (
                            <p key={idx} style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                                <strong>{key === "문의 및 안내" ? "전화번호" : key}:</strong> {spot.contactInfo[key]}
                            </p>
                        ))}

                        <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}><strong>상세 정보:</strong> {spot.detailedInfo}
                        </p>
                    </div>
                </div>
                <div style={{backgroundColor:'#fff5f7',padding:'3rem',borderRadius:'20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',height:'fit-content',margin:'auto'}}>
                    {/* 지도 섹션 */}
                    <div className="map-style" style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        <div style={{display: 'flex', gap: '1rem',marginBottom:'2rem'}}>
                            <div style={{fontSize: '2.5rem', textAlign: 'center',fontWeight:'bold'}}>위치</div>
                            <div style={{fontSize: '1.5rem', paddingTop: '12px'}}>
                                {spot.contactInfo && spot.contactInfo["주소"] ? (
                                    <p>주소: {spot.contactInfo["주소"]}</p>  // contactInfo에서 '주소' 키의 값 출력
                                ) : (
                                    <p>주소 정보가 없습니다</p>
                                )}
                            </div>
                            <div style={{fontSize: '1.5rem', paddingTop: '12px', textAlign: 'right', marginLeft: '2rem'}}>
                                <strong>실내/실외:</strong> {spot.indoorOutdoor}</div>
                        </div>
                        <Map latitude={spot.latitude} longitude={spot.longitude}/>
                    </div>
                </div>
            </div>

        </div>
        </div>
    );
};

export default TouristSpotDetailPage;
