import React from "react";
import './Footer.css'; // 커스텀 CSS 파일 추가
import korail from '../assets/images/korail.png';

function Footer() {
    return (
        <footer className="custom-footer">
            <div className="footer-content">
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div className="footer-left" style={{fontSize: '2rem'}}>
                        Donghae.zip
                    </div>
                    <div style={{backgroundColor:"white",display:'flex',borderRadius:'1rem',padding:'5px',boxShadow:'0 4px 12px rgba(0, 0, 0, 0.3)'}}>
                        <p style={{fontSize:'3rem',marginTop:'1.5rem'}}>With</p>
                        <img src={korail} alt="korail" style={{width: '25rem',marginBottom:'1rem'}}/>
                    </div>
                </div>
                <hr className="footer-divider"/>
                <div className="footer-bottom">
                    <p style={{fontSize: '1.3rem'}}>©2024 서경꿈나무들. All rights reserved</p>
                    <div className="footer-links" style={{fontSize: '1.3rem'}}>
                        <a href="/privacy-policy" className="footer-link">Privacy & Policy</a>
                        <a href="/terms-condition" className="footer-link">Terms & Condition</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;