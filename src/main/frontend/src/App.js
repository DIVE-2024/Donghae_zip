import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer"; // Footer 컴포넌트 추가
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="App">
            <Header />
            {/* 페이지 콘텐츠 */}
            <div style={{ minHeight: "calc(100vh - 200px)" }}>
                {/* Header와 Footer의 높이를 제외한 공간에 콘텐츠를 배치 */}
            </div>
            <Footer /> {/* Footer 추가 */}
        </div>
    );
}

export default App;