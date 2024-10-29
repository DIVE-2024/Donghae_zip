import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TouristSpotDetailPage.css';
import Map from '../../components/Map/Map';
import '../../components/Comment/Comment.css'
import {parseJwt} from "../../components/Util/jwtUtils";
import EditComment from "../../components/Comment/EditComment"; //리뷰 수정
import DeleteComment from "../../components/Comment/DeleteComment";
import ReviewCount from "../../components/Comment/ReviewCount";

const TouristSpotDetailPage = () => {
    const { spotId } = useParams();
    const [spot, setSpot] = useState(null);
    const [tags, setTags] = useState([]);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [newComment, setNewComment] = useState(''); // 새 댓글 내용
    const [rating, setRating] = useState(0); // 평점
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [reviewCount, setReviewCount] = useState(0); // 리뷰 개수 상태 추가

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        console.log("Retrieved Token:", token); // 토큰 출력

        if (token) {
            try {
                const decoded = parseJwt(token);
                console.log("Decoded JWT:", decoded); // 디코딩된 JWT 내용 출력

                if (decoded && decoded.sub) {
                    setUserId(decoded.sub);  // sub 필드를 userId처럼 사용
                } else {
                    console.log("sub not found in JWT");
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            console.log("Token not found in session storage");
        }
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
        axios.get(`/api/comments/tourist-spots/${spotId}/tags`)
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
            });

        // 해당 여행지에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/tourist-spots/${spotId}/reviews`)
            .then(response =>{
                console.log("댓글 API 응답 데이터: ", response.data);
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            })
    }, [spotId]);

    if (!spot) {
        return <p>Loading...</p>;
    }

    // 평점에 따른 별 이모지 반환 함수
    const renderStars = (rating) => {
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                    <i style={{fontSize:'1.8rem'}} key={index} className={`bi ${index < rating ? 'bi-star-fill text-warning' : 'bi-star'}`}></i>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,  // 12시간 형식 (AM/PM)
        };
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', options);
    };

    // 댓글 작성
    const handlePostComment = () => {
        if (newComment.trim() === '') {
            setWarningMessage("댓글을 입력해야 합니다.");
            setShowWarning(true);
            return;
        }

        if (rating < 1 || rating > 5) {
            setWarningMessage("평점은 1에서 5 사이로 선택해야 합니다.");
            setShowWarning(true);
            return;
        }

        const commentRequest = {
            content: newComment,
            rating: rating,
            touristSpotId: parseInt(spotId) // id를 숫자로 변환
        };

        // JWT 토큰을 Authorization 헤더에 추가
        const token = sessionStorage.getItem('token'); // 동일한 저장소에서 토큰 가져오기

        axios.post('/api/comments', commentRequest, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log("서버로부터 받은 응답 데이터: ", response.data);
                setComments([...comments, response.data]); // 새 댓글 추가
                setNewComment(''); // 댓글 입력란 초기화
                setRating(0); // 평점 초기화
            })
            .catch(error => {
                console.error('Error posting comment:', error);
            });
    };

    // 댓글 목록 갱신 처리 함수
    const handleUpdateComment = (updatedComment) => {
        setComments(comments.map(comment =>
            comment.commentId === updatedComment.commentId ? updatedComment : comment
        ));
    };

    // 댓글 삭제 처리 함수
    const handleDeleteComment = (deletedCommentId) => {
        setComments(comments.filter(comment => comment.commentId !== deletedCommentId));
    };

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
                <div style={{display: 'flex',gap:'8rem',justifyContent:'center'}}>
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
                    <div style={{backgroundColor:'#fff5f7',padding:'3rem',borderRadius:'20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',height:'fit-content',marginTop:'8%'}}>
                        {/* 지도 섹션 */}
                        <div className="map-style" style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem'}}>
                                {/* 위치 제목 */}
                                <div style={{
                                    fontSize: '2.5rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    flexBasis: '100%'
                                }}>
                                    위치
                                </div>

                                {/* 주소 정보 */}
                                <div style={{
                                    fontSize: '1.5rem',
                                    paddingTop: '12px',
                                    flexBasis: 'auto',
                                    flexGrow: 1,
                                    wordBreak: 'break-word'
                                }}>
                                    {spot.contactInfo && spot.contactInfo["주소"] ? (
                                        <div style={{fontSize:'1.5rem'}}>주소: {spot.contactInfo["주소"]}</div>  // contactInfo에서 '주소' 키의 값 출력
                                    ) : (
                                        <p>주소 정보가 없습니다</p>
                                    )}
                                </div>

                                {/* 실내/실외 정보 */}
                                <div style={{
                                    fontSize: '1.5rem',
                                    paddingTop: '12px',
                                    textAlign: 'right',
                                    marginLeft: '2rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <strong>실내/실외:</strong> {spot.indoorOutdoor}
                                </div>
                            </div>

                            <Map latitude={spot.latitude} longitude={spot.longitude}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 댓글 섹션 */}
            <div className="comment-section" style={{padding: '20px'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px'}}>리뷰</div>
                {/* ReviewCount 컴포넌트를 사용하여 리뷰 개수 표시 */}
                <ReviewCount entityType="tourist-spots" id={spotId} count={reviewCount}/>
                {comments.length === 0 ? (
                    <p style={{fontSize: '1.5rem'}}>아직 작성된 댓글이 없습니다.</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={comment.commentId || index} className="comment" style={{
                            backgroundColor: '#f9f9f9',
                            borderRadius: '10px',
                            padding: '15px',
                            marginBottom: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            fontSize: '1.6rem'
                        }}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px'}}>
                                    <strong style={{fontSize: '1.8rem', color: '#333'}}>
                                        {comment.member?.nickname || `익명 ${comment.user_id}`}
                                    </strong>
                                    <div>{renderStars(comment.rating)}</div>
                                </div>
                                <div>
                                    <span style={{
                                        fontSize: '1.2rem',
                                        color: '#888'
                                    }}>{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>
                            {/* 댓글 내용 */}
                            <p style={{
                                color: '#555',  // 글자 색상
                                fontSize: '1.6rem',  // 글자 크기
                                marginBottom: '10px',  // 아래 여백
                                textAlign: 'left'  // 텍스트 왼쪽 정렬
                            }}>
                                {comment.content}
                            </p>
                            {/* 로그인한 사용자와 댓글 작성자가 일치할 때만 수정/삭제 버튼 표시 */}
                            {comment.member.email === userId && (
                                <div style={{textAlign: 'right'}}>
                                    <EditComment
                                        commentId={comment.commentId}
                                        content={comment.content}
                                        rating={comment.rating}
                                        id={spotId}
                                        userId={userId}
                                        onSave={handleUpdateComment} // 수정 후 댓글 목록 갱신
                                        entityType="touristSpot"
                                    />
                                    <DeleteComment
                                        commentId={comment.commentId}
                                        userId={userId}
                                        onDelete={handleDeleteComment} // 삭제 후 댓글 목록 갱신
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
                {/* 댓글 작성 폼 */}
                <div className="mt-4">
                    <div style={{fontSize: '1.8rem'}}>리뷰 작성하기</div>
                    <div className="d-flex align-items-center mb-2">
                        <label htmlFor="rating" className="me-2" style={{fontSize:'1.5rem'}}>평점:</label>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star'}`}
                                style={{cursor: 'pointer', fontSize: '1.5rem'}}
                                onClick={() => setRating(star)}
                            ></i>
                        ))}
                    </div>
                    <textarea
                        style={{height: '10rem', fontSize:'1.5rem'}}
                        className="form-control mb-2"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                    />
                    <button style={{width:'9rem',height:'3.5rem',fontSize:'1.8rem'}} onClick={handlePostComment} className="btn btn-primary">리뷰 작성</button>
                </div>
            </div>
        </div>
    );
};

export default TouristSpotDetailPage;
