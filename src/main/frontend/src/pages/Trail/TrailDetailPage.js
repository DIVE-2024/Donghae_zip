import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TrailDetailPage.css';

const TrailDetailPage = () => {
    const { id } = useParams(); // URL에서 코스 ID 가져오기
    const [trail, setTrail] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록 저장
    const [newComment, setNewComment] = useState(''); // 새 댓글 내용
    const [rating, setRating] = useState(0); // 평점
    const [userId, setUserId] = useState(1); // 로그인된 사용자 ID, 추후 실제 로그인 사용자 ID로 대체

    useEffect(() => {
        // 특정 코스의 상세 정보를 가져오는 API 호출
        axios.get(`/api/trails/${id}`)
            .then(response => {
                setTrail(response.data);
            })
            .catch(error => {
                console.error('Error fetching trail data:', error);
            });

        // 해당 코스에 대한 댓글 목록을 가져오는 API 호출
        axios.get(`/api/comments/trails/${id}/reviews`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, [id]);

    if (!trail) {
        return <div>Loading...</div>;
    }

    // 평점에 따른 별 이모지 반환 함수
    const renderStars = (rating) => {
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                    <i key={index} className={`bi ${index < rating ? 'bi-star-fill text-warning' : 'bi-star'}`}></i>
                ))}
            </div>
        );
    };

    // 댓글 작성
    const handlePostComment = () => {
        if (rating < 1 || rating > 5) {
            alert("평점은 1에서 5 사이로 선택해야 합니다.");
            return;
        }

        const commentRequest = {
            content: newComment,
            rating: rating,
            trailId: id
        };

        axios.post(`/api/comments?userId=${userId}`, commentRequest)
            .then(response => {
                setComments([...comments, response.data]); // 새 댓글 추가
                setNewComment(''); // 댓글 입력란 초기화
                setRating(0); // 평점 초기화
            })
            .catch(error => {
                console.error('Error posting comment:', error);
            });
    };

    // 댓글 삭제
    const handleDeleteComment = (commentId) => {
        axios.delete(`/api/comments/${commentId}?userId=${userId}`)
            .then(() => {
                setComments(comments.filter(comment => comment.id !== commentId)); // 삭제된 댓글 제거
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
            });
    };

    return (
        <div className="container mt-5">
            {/* 코스명 */}
            <h1 className="trail-title text-center mb-4">{trail.courseName}</h1>

            {/* 별 모양 */}
            <div className="text-center mb-2">
                {renderStars(3)} {/* 여기에 trail의 기본 평점이 있다고 가정함 */}
            </div>

            {/* 큰 이미지 */}
            <div className="text-center mb-4">
                <img src={trail.imageUrls[0]} className="img-fluid detail-image" alt={trail.courseName} />
            </div>

            {/* 좋아요 및 리뷰 버튼 */}
            <div className="text-center mb-4">
                <button className="btn btn-outline-primary me-3">
                    <i className="bi bi-heart"></i>
                </button>
                <button className="btn btn-outline-primary">
                    <i className="bi bi-chat"></i>
                </button>
            </div>

            {/* 상세 정보 섹션 */}
            <div className="detail-info-section p-4 mb-5">
                <h4>상세 정보</h4>
                <p><strong>코스 개요:</strong> {trail.courseOverview}</p>
                <p><strong>길이:</strong> {trail.lengthInKm}km</p>
                <p><strong>소요 시간:</strong> {Math.floor(trail.timeInMinutes / 60)}시간 {trail.timeInMinutes % 60}분</p>
                <p><strong>난이도:</strong> {trail.difficulty}</p>
                <p><strong>관광 포인트:</strong> {trail.touristPoints}</p>
                {trail.travelInfo && <p><strong>여행 정보:</strong> {trail.travelInfo}</p>}
                <p><strong>시작점:</strong> {trail.startPoint}</p>
                <p><strong>종점:</strong> {trail.endPoint}</p>
            </div>

            {/* 댓글 섹션 */}
            <div className="comment-section mt-4">
                <h3>리뷰</h3>
                {comments.length === 0 ? (
                    <p>아직 작성된 댓글이 없습니다.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment mb-3 p-3 border rounded">
                            <p><strong>{comment.member?.name || `익명 ${comment.user_id}`}:</strong> {comment.content}</p>
                            <div>{renderStars(comment.rating)}</div> {/* 평점 별 이모티콘 */}
                            {/* 로그인된 사용자만 삭제 가능 */}
                            {comment.member?.userId === userId && (
                                <button onClick={() => handleDeleteComment(comment.id)} className="btn btn-danger btn-sm mt-2">삭제</button>
                            )}
                        </div>
                    ))
                )}

                {/* 댓글 작성 폼 */}
                <div className="mt-4">
                    <h5>리뷰 작성하기</h5>
                    <textarea
                        className="form-control mb-2"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                    />
                    <div className="d-flex align-items-center mb-2">
                        <label htmlFor="rating" className="me-2">평점:</label>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star'}`}
                                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                                onClick={() => setRating(star)}
                            ></i>
                        ))}
                    </div>
                    <button onClick={handlePostComment} className="btn btn-primary">리뷰 작성</button>
                </div>
            </div>
        </div>
    );
};

export default TrailDetailPage;