import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null; // 모달이 열리지 않았으면 렌더링하지 않음

    return (
        <div className="modal">
            <div className="modal-content">
                <div style={{fontSize:'2rem'}}>{title}</div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    <button className="confirm-button" onClick={onConfirm}>
                        확인
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
