import { useState } from 'react';
import axios from 'axios';
import axiosInstance from "../../api/axiosInstance";

const EditComment = ({ commentId, content, rating, id, userId, onSave, entityType }) => {
    const [editedContent, setEditedContent] = useState(content);
    const [editedRating, setEditedRating] = useState(rating);
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveEditedComment = async () => {
        if (!sessionStorage.getItem('token')) {
            console.error('Token is missing');
            return;
        }

        const updatedComment = {
            content: editedContent,
            rating: editedRating,
            [`${entityType}Id`]: parseInt(id) // restaurantId, accommodationId 등 동적으로 설정
        };

        try {
            const response = await axiosInstance.put(`/api/comments/${commentId}`, updatedComment, {
                params: { email: userId }
            });

            console.log("Response data:", response.data);  // 서버에서 받은 응답 데이터 확인
            onSave(response.data); // 상위 컴포넌트에서 댓글 목록 갱신 처리
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating comment:', error.response?.data || error.message);
        }
    };



    const renderStars = (rating) => {
        return (
            <div className="star-rating" style={{ marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <i
                        key={star}
                        className={`bi ${star <= editedRating ? 'bi-star-fill text-warning' : 'bi-star'}`}
                        style={{ cursor: 'pointer', fontSize: '1.8rem' }}
                        onClick={() => setEditedRating(star)}
                    ></i>
                ))}
            </div>
        );
    };

    return isEditing ? (
        <div>
            {/* 별점 수정 */}
            <div className="d-flex align-items-center mb-2">
                <label htmlFor="rating" className="me-2" style={{ fontSize: '1.5rem' }}>평점:</label>
                {renderStars(editedRating)}
            </div>

            {/* 댓글 내용 수정 */}
            <textarea
                value={editedContent}
                onChange={e => setEditedContent(e.target.value)}
                style={{
                    width: '100%',
                    height: '6rem',
                    fontSize: '1.5rem',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    padding: '10px',
                    border: '1px solid #ccc'
                }}
            />

            {/* 수정 완료/취소 버튼 */}
            <div style={{ textAlign: 'right' }}>
                <button onClick={handleSaveEditedComment} style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    marginRight: '10px'
                }}>수정 완료</button>
                <button onClick={() => setIsEditing(false)} style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px'
                }}>취소</button>
            </div>
        </div>
    ) : (
        <button className="btn btn-info btn-sm" style={{
            width: '4rem',
            height: '3rem',
            fontSize: '1.5rem',
            paddingBottom: '3px',
            marginRight:'1rem',
            marginTop:'5px',
            color:'white'
        }} onClick={() => setIsEditing(true)}>수정</button>
    );
};

export default EditComment;