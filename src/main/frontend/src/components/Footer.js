import React from "react";
import './Footer.css'; // 커스텀 CSS 파일 추가

function Footer() {
    return (
        <footer className="custom-footer">
            <div className="footer-content">
                <div className="footer-left">
                    Donghae.zip
                </div>
                <hr className="footer-divider" />
                <div className="footer-bottom">
                    <span>©2024 서경꿈나무들. All rights reserved</span>
                    <div className="footer-links">
                        <a href="/privacy-policy" className="footer-link">Privacy & Policy</a>
                        <a href="/terms-condition" className="footer-link">Terms & Condition</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;