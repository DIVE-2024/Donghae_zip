import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map from '../../components/Map/Map';
import AccommodationImage from '../../components/ImageUrl/AccommodationImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AccommodationDetailPage.css';
import {parseJwt} from "../../components/Util/jwtUtils";
import EditComment from "../../components/Comment/EditComment"; //리뷰 수정
import DeleteComment from "../../components/Comment/DeleteComment";
import ReviewCount from "../../components/Comment/ReviewCount";

const Accommodation = () => {
    const { uniqueId } = useParams();
    const [accommodation, setAccommodation] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [newComment, setNewComment] = useState(''); // 새 댓글 내용
    const [rating, setRating] = useState(0); // 평점
    const [userId, setUserId] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
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

        axios.get(`/api/accommodations/${uniqueId}`, {})
            .then(response => {
                const data = response.data;
                console.log(response);

                // 이미지 URL 필드명 변경 (imageUrl로 처리)
                const parsedAccommodation = {
                    ...data,
                    imageUrl: Array.isArray(data.imageUrl) ? data.imageUrl : [data.imageUrl], // 배열이 아닌 경우 배열로 처리
                    facilities: data.facilities ? JSON.parse(data.facilities) : []
                };

                setAccommodation(parsedAccommodation);
            })
            .catch(error => {
                console.error('Error fetching accommodation data:', error);
            });

        // 해당 코스에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/accommodations/${uniqueId}/reviews`)
            .then(response => {
                console.log("댓글 API 응답 데이터: ", response.data);
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, [uniqueId]);

    if (!accommodation) {
        return <div>Loading...</div>;
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
            accommodationId: parseInt(uniqueId) // id를 숫자로 변환
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
            <div className="container mt-5">
                {/* 숙소명 */}
                <div style={{fontSize:'4rem'}} className="accommodation-title text-center mb-4">{accommodation.name}</div>

                {/* 별 모양 */}
                <div className="text-center mb-2">
                    {[...Array(4)].map((_, index) => (
                        <i key={index} className="bi bi-star-fill text-warning"></i>
                    ))}
                    <i className="bi bi-star text-secondary"></i>
                </div>

                {/* 이미지 출력 */}
                <div className="accommodation-detail">
                    <div className="accommodation-image">
                        <AccommodationImage imageUrls={accommodation.imageUrl}/>
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

                <div style={{display: 'flex',gap:'8rem',width:'120%',marginLeft:'-3rem',marginBottom:'3rem'}}>
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <div className='spot-info-section' style={{
                            marginBottom: '2rem',
                            width: '40rem',
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
                            <strong>숙소명:</strong> {accommodation.name}</p>
                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}>
                                <strong>전화번호:</strong> {accommodation.phoneNumber}</p>
                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>웹사이트:</strong> <a
                                href={accommodation.website_url} target="_blank"
                                rel="noopener noreferrer">{accommodation.website_url}</a></p>
                            <p style={{fontSize: '1.8rem', marginBottom: '1rem'}}><strong>평균
                                가격:</strong> {accommodation.averagePrice.toLocaleString()}원</p>

                            {/* 편의시설 추가 */}
                            <h4 className="mt-4">편의시설</h4>
                            <ul className="list-inline">
                                {accommodation.facilities.map((facility, index) => (
                                    <li key={index} style={{fontSize:'1.7rem',margin:'5px'}} className="list-inline-item badge bg-info text-white me-2 p-2">
                                        {facility}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* 지도 */}
                    <div style={{backgroundColor: '#fff5f7',padding:'3rem',borderRadius:'20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',height:'40rem',margin:'auto',width:'40rem'}}>
                        <div className="map-style" style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            height:'31rem',
                            width:'35rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '2rem',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{fontSize: '2.5rem', textAlign: 'center', fontWeight: 'bold'}}>위치</div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    paddingTop: '12px',
                                    wordBreak: 'break-word'
                                }}>
                                    주소: {accommodation.address}
                                </div>
                            </div>

                            <Map latitude={accommodation.latitude} longitude={accommodation.longitude}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 댓글 섹션 */}
            <div className="comment-section" style={{padding: '20px'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px'}}>리뷰</div>
                <ReviewCount entityType="accommodations" id={uniqueId} count={reviewCount}/>
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
                                        id={uniqueId}
                                        userId={userId}
                                        onSave={handleUpdateComment} // 수정 후 댓글 목록 갱신
                                        entityType="Accommodation"
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
                    <button onClick={handlePostComment} className="btn btn-primary">리뷰 작성</button>
                </div>
            </div>
        </div>
    );
};

export default Accommodation;