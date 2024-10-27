import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Bootstrap을 사용할 경우 import
import './custom-modal.css'; // 경고창 스타일이 정의된 CSS 파일을 import


const Warning = ({ show, message, onConfirm, onCancel }) => {
    return (
        <Modal show={show} onHide={onCancel} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>경고</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: '1.8rem', padding: '3rem' }}>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel} style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>
                    취소
                </Button>
                <Button variant="danger" onClick={onConfirm} style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>
                    확인
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Warning;
