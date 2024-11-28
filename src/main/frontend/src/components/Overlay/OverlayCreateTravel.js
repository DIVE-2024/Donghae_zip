import React, { useState } from 'react';
import './OverlayCreateTravel.css'; // 스타일링 파일 (따로 작성)

const OverlayCreateTravel = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState(''); // 일정 제목 상태

    const handleSave = () => {
        if (title.trim() === '') {
            alert('일정 이름을 입력해주세요.');
            return;
        }
        onSave(title); // 부모 컴포넌트에 입력된 이름 전달
        setTitle(''); // 입력값 초기화
        onClose(); // 오버레이 닫기
    };

    if (!isOpen) return null; // 열리지 않은 경우 렌더링하지 않음

    return (
        <div className="travel-overlay">
            <div className="travel-overlay-content">
                <h2>플래너 이름을 지어주세요!</h2>
                <input
                    type="text"
                    placeholder="일정 이름을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{width:'80%',height:'3rem',fontSize:'1.5rem'}}
                />
                <div className="overlay-buttons">
                    <button onClick={onClose} className="travel-cancel-button">
                        취소
                    </button>
                    <button onClick={handleSave} className="travel-save-button">
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverlayCreateTravel;
