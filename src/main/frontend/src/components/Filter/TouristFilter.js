import React from "react";
import "./TouristFilter.css";

const TouristFilter = ({
                           title,
                           setTitle,
                           region,
                           setRegion,
                           indoorOutdoor,
                           setIndoorOutdoor,
                           handleCategoryClick,
                           resetFilters,
                       }) => {
    return (
        <div className="filter-bar">
            {/* 제목 검색 필터 */}
            <input
                type="text"
                className="form-control"
                placeholder="제목 검색"
                value={title}
                onChange={(e) => setTitle(e.target.value)} // 제목 상태만 업데이트
            />

            {/* 지역 선택 필터 */}
            <select
                className="form-select"
                value={region}
                onChange={(e) => {
                    setRegion(e.target.value); // 지역 상태 업데이트
                }}
            >
                <option value="">지역 선택</option>
                <option value="부산">부산</option>
                <option value="울산">울산</option>
            </select>

            {/* 실내/실외 선택 필터 */}
            <select
                className="form-select"
                value={indoorOutdoor}
                onChange={(e) => {
                    setIndoorOutdoor(e.target.value); // 실내/실외 상태를 한글로 설정
                }}
            >
                <option value="">실내/실외 선택</option>
                <option value="실내">실내</option>
                <option value="실외">실외</option>
            </select>


            <div className="category-box">
                <div className="category-title">카테고리 필터</div>
                <div className="category-buttons">
                    {[
                        "공원",
                        "문화시설",
                        "레포츠",
                        "테마거리",
                        "쇼핑",
                        "문화유산",
                        "산책로",
                        "해수욕장",
                        "시장",
                        "마을",
                        "사찰",
                        "체험시설",
                        "지질공원",
                        "테마파크",
                        "놀이시설",
                        "키즈카페",
                        "전시관",
                        "식물원",
                        "계곡",
                        "영화관",
                        "아쿠아리움",
                        "해안지역",
                        "유적지",
                        "상점",
                        "도시",
                        "공방",
                        "스파",
                        "명소",
                    ].map((category) => (
                        <button
                            key={category}
                            className="category-btn"
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* 필터 초기화 버튼 */}
            <button className="filter-reset-button" onClick={resetFilters}>
                필터 초기화
            </button>
        </div>
    );
};

export default TouristFilter;
