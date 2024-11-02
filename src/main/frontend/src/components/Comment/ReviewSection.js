// components/ReviewSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditComment from "./EditComment";
import DeleteComment from "./DeleteComment";
import ReviewCount from "./ReviewCount";
import StarRating from './StarRating';
import './ReviewSection.css';

const ReviewSection = ({ entityType, entityId, userId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [warningMessage, setWarningMessage] = useState('');

    useEffect(() => {
        // 컴포넌트가 로드될 때 한 번만 댓글 목록을 불러옴
        fetchComments();
    }, [entityType, entityId]);

    const fetchComments = () => {
        axios.get(`/api/comments/${entityType}/${entityId}/reviews`)
            .then(response => setComments(response.data))
            .catch(error => console.error(`Error fetching ${entityType} comments:`, error));
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', options);
    };

    const handlePostComment = () => {
        if (newComment.trim() === '' || rating < 1 || rating > 5) {
            setWarningMessage("댓글 내용과 평점을 모두 입력해주세요.");
            return;
        }

        const token = sessionStorage.getItem('token');

        // 각 카테고리에 맞는 ID 필드를 동적으로 설정
        const fieldMapping = {
            restaurants: 'restaurantId',
            accommodations: 'accommodationId',
            festivals: 'festivalId',
            'tourist-spots': 'touristSpotId', // 정확히 매핑되었는지 확인
            trails: 'trailId'
        };
        const idField = fieldMapping[entityType]; // 현재 entityType에 맞는 필드명 선택

        const requestData = {
            content: newComment,
            rating,
            [idField]: parseInt(entityId) // 선택한 필드명으로 ID 설정
        };

        console.log("Sending comment data:", requestData); // 요청 데이터 확인용 로그

        axios.post('/api/comments', requestData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        })
            .then(response => {
                setNewComment('');
                setRating(0);
                fetchComments(); // 댓글 목록을 다시 불러옵니다
            })
            .catch(error => console.error('Error posting comment:', error));
    };



    return (
        <div className="comment-section" style={{ padding: '20px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>리뷰</div>
            <ReviewCount entityType={entityType} id={entityId} count={comments.length} />
            {comments.length === 0 ? (
                <p style={{ fontSize: '1.5rem' }}>아직 작성된 댓글이 없습니다.</p>
            ) : (
                comments.map(comment => (
                    <div
                        key={comment.commentId}
                        className="comment"
                        style={{
                            backgroundColor: '#f9f9f9',
                            borderRadius: '10px',
                            padding: '15px',
                            marginBottom: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            fontSize: '1.6rem',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                                <strong style={{ fontSize: '1.8rem', color: '#333' }}>
                                    {comment.member?.nickname || `익명 ${comment.user_id}`}
                                </strong>
                                <StarRating rating={comment.rating} />
                            </div>
                            <span style={{ fontSize: '1.2rem', color: '#888' }}>
                                {formatDate(comment.created_at || comment.createdAt)}
                            </span>
                        </div>
                        <p style={{ color: '#555', fontSize: '1.6rem', marginBottom: '20px', textAlign: 'left' }}>
                            {comment.content}
                        </p>
                        {comment.member.email === userId && (
                            <div style={{ textAlign: 'right' }}>
                                <EditComment
                                    commentId={comment.commentId}
                                    content={comment.content}
                                    rating={comment.rating}
                                    id={entityId}
                                    userId={userId}
                                    onSave={(updatedComment) =>
                                        setComments(comments.map(c => c.commentId === updatedComment.commentId ? updatedComment : c))
                                    }
                                    entityType={entityType}
                                />
                                <DeleteComment
                                    commentId={comment.commentId}
                                    userId={userId}
                                    onDelete={(deletedCommentId) =>
                                        setComments(comments.filter(c => c.commentId !== deletedCommentId))
                                    }
                                />
                            </div>
                        )}
                    </div>
                ))
            )}
            <div className="mt-4">
                <div style={{ fontSize: '1.8rem' }}>리뷰 작성하기</div>
                <div className="d-flex align-items-center mb-2">
                    <label htmlFor="rating" className="me-2" style={{ fontSize: '1.5rem' }}>평점:</label>
                    {[1, 2, 3, 4, 5].map(star => (
                        <i
                            key={star}
                            className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star'}`}
                            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                            onClick={() => setRating(star)}
                        ></i>
                    ))}
                </div>
                <textarea
                    className="form-control mb-2"
                    style={{ height: '10rem', fontSize: '1.5rem' }}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />
                <button
                    style={{ width: '9rem', height: '3.5rem', fontSize: '1.8rem' }}
                    onClick={handlePostComment}
                    className="btn btn-primary"
                >
                    리뷰 작성
                </button>
            </div>
        </div>
    );
};

export default ReviewSection;
