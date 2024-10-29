import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map from '../../components/Map/Map';
import RestaurantImage from '../../components/ImageUrl/RestaurantImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './RestaurantDetailPage.css';
import {parseJwt} from "../../components/Util/jwtUtils";
import EditComment from "../../components/Comment/EditComment"; //리뷰 수정
import DeleteComment from "../../components/Comment/DeleteComment"; //리뷰 삭제
import ReviewCount from "../../components/Comment/ReviewCount";

const Restaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [newComment, setNewComment] = useState(''); // 새 댓글 내용
    const [rating, setRating] = useState(0); // 평점
    const [userId, setUserId] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [reviewCount, setReviewCount] = useState(0); // 리뷰 개수 상태 추가


    useEffect(() => {
        const token = sessionStorage.getItem('token'); // 동일한 저장소에서 토큰 가져오기

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

        axios.get(`/api/restaurants/${id}`, {})
            .then(response => {
                const data = response.data;

                const parsedRestaurant = {
                    ...data,
                    imageUrl: JSON.parse(data.imageUrl),
                    businessHours: JSON.parse(data.businessHours),
                    info: JSON.parse(data.info),
                    menuInfo: JSON.parse(data.menuInfo),
                    tags: JSON.parse(data.tags)
                };
                console.log(response);

                setRestaurant(parsedRestaurant);
            })
            .catch(error => {
                console.error('Error fetching restaurant data:', error);
            });

        // 해당 코스에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/restaurants/${id}/reviews`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, [id]);

    if (!restaurant) {
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
            restaurantId: parseInt(id) // id를 숫자로 변환
        };

        // JWT 토큰을 Authorization 헤더에 추가
        const token = sessionStorage.getItem('token'); // 동일한 저장소에서 토큰 가져오기
        console.log("sessionStorage에 저장된 토큰:",token);
        console.log("전송할 commentRequest:", commentRequest); // 전송할 데이터 확인

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
            <div className="container mt-5">
                {/* 식당명 */}
                <div style={{fontSize: '4rem'}} className="text-center mb-2">{restaurant.name}</div>

                {/* 해시태그 */}
                <div className="text-center mb-2">
                    {restaurant.tags && restaurant.tags.map((tag, index) => (
                        <span style={{height: '3rem', fontSize: '1.5rem', padding: '10px', textAlign: 'center'}}
                              key={index} className="badge bg-secondary me-1">#{tag}</span>
                    ))}
                </div>

                {/* 별 모양 */}
                <div className="text-center mb-2">
                    {[...Array(4)].map((_, index) => (
                        <i key={index} className="bi bi-star-fill text-warning"></i>
                    ))}
                    <i className="bi bi-star text-secondary"></i>
                </div>

                {/* 이미지 출력 */}
                <div className="restaurant-detail">
                    <div className="restaurant-image">
                        {restaurant.imageUrl && <RestaurantImage imageUrls={restaurant.imageUrl}/>}
                    </div>
                </div>

                {/* 좋아요 및 공유 버튼 */}
                <div className="text-center mb-4">
                    <button className="btn btn-outline-primary me-3">
                        <i className="bi bi-heart"></i>
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="bi bi-share"></i>
                    </button>
                </div>

                {/* 상세 정보 섹션 */}
                <div style={{display: 'flex', gap: '8rem', width: '120%', marginLeft: '-3rem'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className='spot-info-section' style={{
                            marginBottom: '2rem',
                            width: '50rem',
                            lineHeight: '1.6',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>상세 정보
                            </div>

                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}>
                                <strong>해시태그:</strong> {restaurant.hashtag}</p>
                            <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                                <strong>식당명:</strong> {restaurant.name}</p>
                            <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                                <strong>전화번호:</strong> {restaurant.phone}</p>
                            <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}><strong>영업시간:</strong></p>
                            <ul style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                                {restaurant.businessHours.map((hour, index) => (
                                    <li key={index}>{hour}</li>
                                ))}
                            </ul>

                            {/* 메뉴 정보 */}
                            <h4>메뉴 정보</h4>
                            <ul style={{
                                maxHeight: '500px',  // 최대 높이를 설정하여 스크롤 가능하게 함
                                overflowY: 'auto',    // 내용이 많으면 스크롤 추가
                                fontSize: '1.5rem',
                                marginBottom: '1rem',
                                paddingRight: '1rem'  // 스크롤바와 텍스트가 겹치지 않도록 패딩 추가
                            }}>
                                {restaurant.menuInfo.map((menu, index) => (
                                    <li style={{marginBottom: '1rem'}} key={index}>{menu}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* 지도 출력 */}
                    <div style={{
                        backgroundColor: '#fff5f7',
                        padding: '3rem',
                        borderRadius: '20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
                        height: 'fit-content',
                        margin: 'auto',
                        width: '40rem'
                    }}>
                        <div className="map-style" style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                                <div style={{fontSize: '2.5rem', textAlign: 'center', fontWeight: 'bold'}}>위치</div>
                                <div style={{fontSize: '1.5rem', paddingTop: '12px'}}>주소: {restaurant.address}</div>
                            </div>
                            <Map latitude={restaurant.latitude} longitude={restaurant.longitude}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="comment-section" style={{padding: '20px'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px'}}>리뷰</div>
                <ReviewCount entityType="restaurants" id={id} count={reviewCount}/>
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
                                        id={id}
                                        userId={userId}
                                        onSave={handleUpdateComment} // 수정 후 댓글 목록 갱신
                                        entityType="restaurant"
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
                    <button style={{width:'9rem',height:'3.5rem',fontSize:'1.8rem'}} onClick={handlePostComment} className="btn btn-primary">
                        리뷰 작성
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;