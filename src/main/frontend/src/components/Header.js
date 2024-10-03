import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import Typography from "@mui/material/Typography"; // MUI의 Typography 컴포넌트 추가
import './Header.css'; // 커스텀 CSS 파일 추가

function Header() {
    const [openDropdown, setOpenDropdown] = useState(null); // 드롭다운 메뉴 상태를 관리

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container fluid> {/* Container를 fluid로 설정하여 양 끝으로 배치 */ }
                {/* Donghae.zip 로고 왼쪽에 여백 추가 */ }
                <Navbar.Brand href="#" className="me-auto" style={{ marginLeft: "60px" }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: "white", fontWeight: "bold", fontSize: "1.8rem" }}
                    >
                        Donghae.zip
                    </Typography>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {/* 역내 정보 버튼 */}
                        <Button variant="outline-light" className="custom-nav-button">역내 정보</Button>

                        {/* 여행 정보 드롭다운 */}
                        <NavDropdown
                            title={<Button variant="outline-light" className="custom-nav-button">여행 정보</Button>}
                            id="basic-nav-dropdown"
                            onMouseEnter={() => setOpenDropdown("travel")}
                            onMouseLeave={() => setOpenDropdown(null)}
                            show={openDropdown === "travel"}
                            className="custom-nav-dropdown"
                        >
                            <NavDropdown.Item href="#">동해선 여행지.zip</NavDropdown.Item>
                            <NavDropdown.Item href="#">동해선 맛집.zip</NavDropdown.Item>
                            <NavDropdown.Item href="#">동해선 축제.zip</NavDropdown.Item>
                            <NavDropdown.Item href="#">동해선 숙소.zip</NavDropdown.Item>
                            <NavDropdown.Item href="#">동해선 둘레길.zip</NavDropdown.Item>
                        </NavDropdown>

                        {/* 동해 출동해 버튼 */}
                        <Button variant="outline-light" className="custom-nav-button">동해 출동해</Button>

                        {/* MyPage 드롭다운 */}
                        <NavDropdown
                            title={<Button variant="outline-light" className="custom-nav-button no-right-margin">MyPage</Button>}
                            id="mypage-nav-dropdown"
                            onMouseEnter={() => setOpenDropdown("mypage")}
                            onMouseLeave={() => setOpenDropdown(null)}
                            show={openDropdown === "mypage"}
                            className="custom-nav-dropdown"
                        >
                            <NavDropdown.Item href="#">찜 목록</NavDropdown.Item>
                            <NavDropdown.Item href="#">내가 쓴 리뷰</NavDropdown.Item>
                        </NavDropdown>

                        {/* 구분선 추가 */}
                        <div className="styled-divider"></div>

                        {/* 회원가입 및 로그인 버튼을 MyPage 오른쪽에 배치 */}
                        <Button variant="primary" className="me-2 custom-button">
                            회원가입
                        </Button>
                        <Button variant="primary" className="custom-button custom-login-margin">
                            Log In
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;