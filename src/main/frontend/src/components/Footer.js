import React from "react";
import './Footer.css'; // 커스텀 CSS 파일 추가

function Footer() {
    return (
        <footer className="custom-footer">
            <div className="footer-content">
                <div className="footer-left" style={{fontSize:'2rem'}}>
                    Donghae.zip
                </div>
                <hr className="footer-divider" />
                <div className="footer-bottom">
                    <p style={{fontSize:'1.3rem'}}>©2024 서경꿈나무들. All rights reserved</p>
                    <div className="footer-links" style={{fontSize:'1.3rem'}}>
                        <a href="/privacy-policy" className="footer-link">Privacy & Policy</a>
                        <a href="/terms-condition" className="footer-link">Terms & Condition</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;