import axios from 'axios';
import { useState } from 'react';
import Warning from "../Warning/Warning";

const DeleteComment = ({ commentId, userId, onDelete }) => {
    const [showWarning, setShowWarning] = useState(false);

    const handleDeleteComment = () => {
        const token = sessionStorage.getItem('token');
        axios.delete(`/api/comments/${commentId}?email=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                onDelete(commentId); // 상위 컴포넌트에서 댓글 목록 갱신 처리
                setShowWarning(false); // 모달 닫기
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
            });
    };

    return (
        <>
            <button className="btn btn-danger btn-sm" style={{
                width: '4rem',
                height: '3rem',
                fontSize: '1.5rem',
                paddingBottom: '3px'
            }} onClick={() => setShowWarning(true)}>삭제</button>
            {/* Warning 모달 */}
            <Warning
                show={showWarning}
                message="정말로 이 댓글을 삭제하시겠습니까?"
                onConfirm={handleDeleteComment}  // 확인 버튼 클릭 시 삭제 함수 실행
                onCancel={() => setShowWarning(false)}  // 취소 버튼 클릭 시 모달 닫기
            />
        </>
    );
};

export default DeleteComment;
