import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL에서 festivalId를 가져오기 위해 useParams 사용
import axios from 'axios';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './FestivalDetailPage.css';
import {parseJwt} from "../../components/Util/jwtUtils";
import EditComment from "../../components/Comment/EditComment"; //리뷰 수정
import DeleteComment from "../../components/Comment/DeleteComment";
import ReviewCount from "../../components/Comment/ReviewCount";

const FestivalDetailPage = () => {
    const { id } = useParams(); // URL에서 festivalId 추출
    const [festival, setFestival] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [newComment, setNewComment] = useState(''); // 새 댓글 내용
    const [rating, setRating] = useState(0); // 평점
    const [userId, setUserId] = useState(null);
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

        axios.get(`/api/festivals/${id}`)
            .then(response => {
                setFestival(response.data);
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching festival data:', error);
            });
        // 해당 코스에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/festivals/${id}/reviews`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, [id]);

    if (!festival) {
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
            alert("댓글을 입력해야 합니다.");
            return;
        }

        if (rating < 1 || rating > 5) {
            alert("평점은 1에서 5 사이로 선택해야 합니다.");
            return;
        }

        const commentRequest = {
            content: newComment,
            rating: rating,
            festivalId: parseInt(id) // id를 숫자로 변환
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
        <div style={{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '5rem',
            width: '90%',
            padding: '2rem',
            margin: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
        }}>
            <Container className="festival-detail-container mt-5" style={{maxWidth: '100%'}}> {/* maxWidth를 100%로 설정 */}
                {/* 축제명 */}
                <div style={{fontSize: '4rem'}} className="festival-title text-center mb-4">{festival.title}</div>

                {/* 별 모양 추가 */}
                <div className="text-center mb-2">
                    {[...Array(4)].map((_, index) => (
                        <i key={index} className="bi bi-star-fill text-warning"></i>
                    ))}
                    <i className="bi bi-star text-secondary"></i>
                </div>
                <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                    {/* 이미지 출력 */}
                    <div className="text-center mb-4" style={{flex: 1}}>
                        {festival.images && festival.images.map((image, idx) => (
                            <img
                                key={idx}
                                className="festival-image mb-3"
                                src={image}
                                alt={`Festival ${idx + 1}`}
                                style={{maxWidth: '100%'}}
                            />
                        ))}
                        <div className="text-center mb-4">
                            <button className="btn btn-outline-primary me-3">
                                <i className="bi bi-heart"></i>
                            </button>
                            <button className="btn btn-outline-primary">
                                <i className="bi bi-chat"></i>
                            </button>
                        </div>
                    </div>

                    <div className="festival-info-section p-4 mb-5" style={{
                        flex: 1,  /* 축제 정보 섹션도 이미지와 같은 크기로 설정 */
                        margin: '6rem',
                        lineHeight: '1.6',
                        textAlign: 'left',
                        marginBottom: '2rem',
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>상세 정보
                        </div>
                        <p><strong>축제명:</strong> {festival.title}</p>
                        <p><strong>축제 시기:</strong> {festival.date}</p>
                        <p><strong>기간:</strong> {festival.period}</p>
                        <p><strong>장소:</strong> {festival.location}</p>
                        <p><strong>홈페이지:</strong> <a href={festival.homepage} target="_blank"
                                                     rel="noopener noreferrer">{festival.homepage}</a></p>
                        <p>
                            <strong>상태:</strong> {festival.status === 'PENDING' ? '예정' : festival.status === 'ONGOING' ? '진행 중' : '완료'}
                        </p>
                    </div>
                </div>
                {/* 댓글 섹션 */}
                <div className="comment-section" style={{padding: '20px'}}>
                    <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px'}}>리뷰</div>
                    <ReviewCount entityType="festivals" id={id} count={reviewCount}/>
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
                                            entityType="Festival"
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
            </Container>
        </div>

    );
};

export default FestivalDetailPage;