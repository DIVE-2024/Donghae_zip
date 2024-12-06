import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios for API requests
import './Overlay.css';
import Modal from "../Modal/Modal";
import TouristFilter from "../Filter/TouristFilter"; // TouristFilter import

const Overlay = ({ closeOverlay, selectedDay, travelId ,onSavePlan}) => {
    const [activeCategory, setActiveCategory] = useState("TOURIST_SPOT");
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [timeSlots, setTimeSlots] = useState([]); // Time slots (06:00 - 24:00)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItem, setModalItem] = useState(null);
    const [selectedTime, setSelectedTime] = useState("06:00");
    const [duration, setDuration] = useState(1);
    const [title, setTitle] = useState(""); // 제목 검색 필터
    const [category, setCategory] = useState(""); // 카테고리 필터
    const [region, setRegion] = useState(""); // 지역 필터
    const [indoorOutdoor, setIndoorOutdoor] = useState(""); // 실내/실외 필터


    const mapPlaceTypeToCategory = (placeType) => {
        switch (placeType) {
            case "RESTAURANT":
                return "식당";
            case "ACCOMMODATION":
                return "숙박/휴양";
            case "TOURIST_SPOT":
                return "여행지";
            default:
                return "기타";
        }
    };
    const fetchData = async () => {
        let url = "";

        if (activeCategory === "TOURIST_SPOT") {
            const params = new URLSearchParams();
            if (title) params.append("title", title);
            if (category) params.append("category", category);
            if (region) params.append("region", region);
            if (indoorOutdoor) params.append("indoorOutdoor", indoorOutdoor);

            params.append("page", currentPage);
            params.append("size", 6);

            url = `/api/tourist-spots/search?${params.toString()}`;
        } else if (activeCategory === "RESTAURANT") {
            url = `/api/restaurants?page=${currentPage}&size=6`;
        } else if (activeCategory === "ACCOMMODATION") {
            url = `/api/accommodations?page=${currentPage}&size=6`;
        }

        try {
            const response = await axios.get(url);
            console.log("Fetched Data:", response.data.content || response.data);
            setData(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Overlay.js 내부에 handleCategoryClick 메서드 추가
    const handleCategoryClick = (selectedCategory) => {
        console.log("Before setCategory:", category); // 현재 상태 확인
        setCategory(selectedCategory); // 카테고리 상태 업데이트
        setCurrentPage(0); // 페이지 초기화
        console.log("After setCategory:", selectedCategory); // 업데이트된 값 확인
        fetchData(); // 필터링된 데이터 가져오기
    };


    const resetFilters = () => {
        setTitle(""); // 제목 초기화
        setCategory(""); // 카테고리 초기화
        setRegion(""); // 지역 초기화
        setIndoorOutdoor(""); // 실내/실외 초기화
        setCurrentPage(0); // 페이지 초기화
        fetchData(); // 필터 초기화 후 데이터 다시 로드
    };


    useEffect(() => {
        fetchData(); // activeCategory에 따라 적절한 API 호출
    }, [activeCategory, title, category, region, indoorOutdoor, currentPage]);


    const normalizeCategory = (category) => category?.trim()?.toLowerCase();

    const getCategoryIcon = (category) => {
        const normalizedCategory = normalizeCategory(category);
        switch (normalizedCategory) {
            case "식당":
                return "/image/RestaurantMarker.png";
            case "숙박/휴양":
                return "/image/AccommodaionMarker.png";
            case "여행지":
                return "/image/TouristSpotMarker.png";
            default:
                return "/image/default_image.png";
        }
    };

    // 일정 삭제 요청 함수
    const deletePlan = async (detailId) => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`/api/travel-detail/${detailId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 삭제 후 상태 업데이트
            const updatedTimeSlots = timeSlots.map((slot) => ({
                ...slot,
                plans: slot.plans.filter((plan) => plan.detailId !== detailId),
            }));
            setTimeSlots(updatedTimeSlots);

            alert("일정이 삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting plan:", error);
            alert("일정을 삭제하는 중 오류가 발생했습니다.");
        }
    };


    // Fetch travel details from the backend
    useEffect(() => {
        const fetchTravelDetails = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get(`/api/travel-detail/travel/${travelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const travelDetails = response.data.travelDetails || [];

                // 06:00 ~ 24:00 시간대 배열 생성
                const defaultTimeSlots = [];
                for (let hour = 6; hour <= 24; hour++) {
                    const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                    defaultTimeSlots.push({ time, plans: [] });
                }

                // 선택한 날짜와 일치하는 데이터만 처리
                const selectedDateString = selectedDay.date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
                const filteredDetails = travelDetails.filter(
                    (detail) => detail.travelDate === selectedDateString
                );

                // filteredDetails 데이터를 시간대와 매핑
                filteredDetails.forEach((detail) => {
                    const startIndex = defaultTimeSlots.findIndex(
                        (slot) => slot.time === detail.startTime.substring(0, 5)
                    );
                    const endIndex = defaultTimeSlots.findIndex(
                        (slot) => slot.time === detail.endTime.substring(0, 5)
                    );

                    for (let i = startIndex; i < endIndex; i++) {
                        if (i >= 0 && i < defaultTimeSlots.length) {
                            defaultTimeSlots[i].plans.push(detail);
                        }
                    }
                });

                console.log("Filtered Time Slots:", defaultTimeSlots);
                setTimeSlots(defaultTimeSlots); // timeSlots 상태 업데이트
            } catch (error) {
                console.error("Error fetching travel details:", error);
                alert("일정을 가져오는 중 오류가 발생했습니다.");
                setTimeSlots([]); // 실패 시 빈 배열로 초기화
            }
        };

        fetchTravelDetails(); // useEffect 내에서 함수 호출
    }, [travelId, selectedDay]);




    // Fetch data whenever the category or page changes
    useEffect(() => {
        fetchCategoryData(activeCategory, currentPage);
    }, [activeCategory, currentPage]);

    const fetchCategoryData = async (category, page = 0, size = 6) => {
        let url = "";
        if (category === "TOURIST_SPOT") url = `/api/tourist-spots/all?page=${page}&size=${size}`;
        else if (category === "RESTAURANT") url = `/api/restaurants?page=${page}&size=${size}`;
        else if (category === "ACCOMMODATION") url = `/api/accommodations?page=${page}&size=${size}`;

        try {
            const response = await axios.get(url);
            console.log("Fetched data:", response.data.content); // 데이터 구조 확인
            setData(response.data.content); // Set the current page's data
            setTotalPages(response.data.totalPages); // Set total pages
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category); // 현재 활성 카테고리 변경
        setTitle(""); // 필터 초기화
        setCategory("");
        setRegion("");
        setIndoorOutdoor("");
        setCurrentPage(0);
    };



    const isTimeSlotAvailable = (startIndex, duration) => {
        for (let i = startIndex; i < startIndex + duration; i++) {
            if (i >= timeSlots.length || timeSlots[i].plans.length > 0 || timeSlots[i]?.reserved) {
                return false;
            }
        }
        return true;
    };

    const addItemToTimeSlot = async (item, startIndex, duration) => {
        const startTime = timeSlots[startIndex].time; // 시작 시간
        const endTimeIndex = startIndex + duration; // 종료 시간 계산
        const endTime = timeSlots[endTimeIndex]?.time || "24:00"; // 종료 시간이 범위를 초과하지 않도록 설정

        if (!isTimeSlotAvailable(startIndex, duration)) {
            alert("선택한 시간대에 이미 일정이 있습니다. 다른 시간을 선택해주세요.");
            return;
        }

        const mapCategoryToPlaceType = (category) => {
            switch (category) {
                case "식당":
                    return "RESTAURANT";
                case "숙박/휴양":
                    return "ACCOMMODATION";
                case "여행지":
                    return "TOURIST_SPOT";
                default:
                    return "TOURIST_SPOT";
            }
        };

        const newPlan = {
            travelDate: selectedDay.date.toISOString().split("T")[0],
            placeType: mapCategoryToPlaceType(item.category),
            placeId: item.id || item.spotId || item.uniqueId,
            startTime: startTime,
            endTime: endTime,
            placeTitle: item.name || item.title,
        };

        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(`/api/travel-detail?travelId=${travelId}`, newPlan, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const addedPlan = response.data;

            // 새로 추가된 일정으로 timeSlots 업데이트
            const updatedTimeSlots = [...timeSlots];
            updatedTimeSlots[startIndex].plans.push({
                ...addedPlan,
                placeTitle: item.name || item.title,
                placeType: mapCategoryToPlaceType(item.category),
                startTime: newPlan.startTime,
                endTime: newPlan.endTime,
            });

            // 예약된 시간 표시
            for (let i = startIndex + 1; i < endTimeIndex; i++) {
                if (i >= 0 && i < updatedTimeSlots.length) {
                    updatedTimeSlots[i].reserved = true;
                }
            }

            // 부모 컴포넌트와 동기화
            onSavePlan([{ ...addedPlan }], selectedDay); // 부모 컴포넌트로 전달
            setTimeSlots(updatedTimeSlots); // 내부 상태 업데이트
            alert("일정이 추가되었습니다!");
            closeModal();
        } catch (error) {
            console.error("Error adding plan:", error);
            alert("일정을 추가하는 중 오류가 발생했습니다.");
        }
    };


    const handleAddToSchedule = () => {
        const startIndex = timeSlots.findIndex((slot) => slot.time === selectedTime);
        if (startIndex === -1) return;
        addItemToTimeSlot(modalItem, startIndex, duration);
    };

    const openModal = (item) => {
        setModalItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalItem(null);
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
            fetchData(); // 데이터 다시 로드
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
            fetchData(); // 데이터 다시 로드
        }
    };


    return (
        <div className="overlay">
            <div className="overlay-content">
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: "1.5rem",}}>
                    <div style={{fontSize: "2.5rem"}}>{selectedDay.dayLabel} 일정 추가</div>
                    <button onClick={closeOverlay} className="close-button" style={{position: "absolute", right: 0, backgroundColor: "#DB4455", width: "5rem", textAlign: "center", padding: "1rem 0.3rem",}}>X</button>
                </div>

                <div className="overlay-body">
                    <div className="schedule-list">
                        <div style={{fontSize: "2.5rem"}}>{selectedDay.dayLabel} 일정</div>
                        <div className="schedule-container">
                            <div className="schedule-container">
                                {
                                    timeSlots
                                        .flatMap((slot) => slot.plans)
                                        .reduce((uniquePlans, plan) => {
                                            const isDuplicate = uniquePlans.some(
                                                (uniquePlan) =>
                                                    uniquePlan.startTime === plan.startTime &&
                                                    uniquePlan.endTime === plan.endTime &&
                                                    uniquePlan.placeId === plan.placeId
                                            );
                                            if (!isDuplicate) {
                                                uniquePlans.push(plan);
                                            }
                                            return uniquePlans;
                                        }, [])
                                        .map((plan, idx) => (
                                            <div key={idx} className="schedule-card">
                                                <div className="plan-item">
                                                    <div className="schedule-time">
                                                        {/* 시간 데이터가 없으면 기본값 처리 */}
                                                        {plan.startTime || "00:00"} ~ {plan.endTime || "00:00"}
                                                    </div>
                                                    <div className="plan-content">
                                                        <img
                                                            src={getCategoryIcon(mapPlaceTypeToCategory(plan.placeType))}
                                                            alt={`${plan.placeType} icon`}
                                                            className="plan-icon"
                                                        />
                                                        <span className="plan-title">{plan.placeTitle || "제목 없음"}</span>
                                                        <button className="delete-button" onClick={() => deletePlan(plan.detailId)}>
                                                            삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>

                        </div>
                    </div>
                    <div className="category-section">
                        <div className="category-tabs">
                            <button
                                className={activeCategory === "TOURIST_SPOT" ? "active" : ""}
                                onClick={() => {
                                    setActiveCategory("TOURIST_SPOT");
                                    setCurrentPage(0);
                                }}
                            >
                                여행지
                            </button>
                            <button
                                className={activeCategory === "RESTAURANT" ? "active" : ""}
                                onClick={() => {
                                    setActiveCategory("RESTAURANT");
                                    setCurrentPage(0);
                                }}
                            >
                                식당
                            </button>
                            <button
                                className={activeCategory === "ACCOMMODATION" ? "active" : ""}
                                onClick={() => {
                                    setActiveCategory("ACCOMMODATION");
                                    setCurrentPage(0);
                                }}
                            >
                            숙박
                            </button>
                        </div>

                        {activeCategory === "TOURIST_SPOT" && (
                            <TouristFilter
                                title={title}
                                setTitle={setTitle}
                                region={region}
                                setRegion={setRegion}
                                indoorOutdoor={indoorOutdoor}
                                setIndoorOutdoor={setIndoorOutdoor}
                                handleCategoryClick={handleCategoryClick} // 카테고리 클릭 이벤트 연결
                                resetFilters={resetFilters} // 필터 초기화
                            />
                        )}

                        <div className="data-list">
                            {data.length > 0 ? (
                                data.map((item) => {

                                    // 이미지 URL 처리
                                    let imageUrl = "/image/default_image.png";
                                    if (item.imageUrls && Array.isArray(item.imageUrls)) {
                                        imageUrl = item.imageUrls[0];
                                    } else if (item.imageUrl) {
                                        try {
                                            const parsedUrls = JSON.parse(item.imageUrl);
                                            imageUrl = Array.isArray(parsedUrls) && parsedUrls.length > 0 ? parsedUrls[0] : item.imageUrl;
                                        } catch (error) {
                                            imageUrl = item.imageUrl;
                                        }
                                    }

                                    return (
                                        <div key={item.id || item.uniqueId || item.spotId} className="data-item">
                                            <div className="image-container">
                                                <img src={imageUrl} alt={item.name || item.title}
                                                     className="data-image"/>
                                            </div>
                                            <div className="data-content">
                                                <h4 className="data-title">{item.title || item.name}</h4>
                                                <p className="data-desc">{item.oneLineDesc || item.address}</p>

                                                {/* 버튼 컨테이너 */}
                                                <div className="data-buttons">
                                                    <button className="data-button" onClick={() => openModal(item)}>
                                                        일정 추가
                                                    </button>
                                                    <button
                                                        className="view-detail-button"
                                                        onClick={() => {
                                                            const category = normalizeCategory(activeCategory);
                                                            const id = item.id || item.spotId || item.uniqueId;

                                                            // 카테고리별 URL 생성
                                                            let detailUrl = "";
                                                            switch (category) {
                                                                case "tourist_spot":
                                                                    detailUrl = `/tourist-spot/${id}`;
                                                                    break;
                                                                case "restaurant":
                                                                    detailUrl = `/restaurant/${id}`;
                                                                    break;
                                                                case "accommodation":
                                                                    detailUrl = `/accommodation/${id}`;
                                                                    break;
                                                                default:
                                                                    console.error("Invalid category:", category);
                                                                    return;
                                                            }

                                                            // 새 창으로 링크 열기
                                                            window.open(detailUrl, "_blank");
                                                        }}
                                                    >
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="empty-message">데이터가 없습니다.</p>
                            )}
                        </div>


                        {/* Pagination */}
                        <div className="pagination">
                            <button onClick={goToPreviousPage} disabled={currentPage === 0}>
                                이전
                            </button>
                            <span>{currentPage + 1} / {totalPages}</span>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages - 1}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleAddToSchedule}
                title="일정 추가"
            >
                <p>{modalItem?.name || modalItem?.title}</p>
                <label>
                    시간:
                    <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                        {timeSlots.map((slot) => (
                            <option key={slot.time} value={slot.time}>
                                {slot.time}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    머무를 시간:
                    <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
                            <option key={d} value={d}>
                                {d}시간
                            </option>
                        ))}
                    </select>
                </label>
            </Modal>

        </div>
    );
};

export default Overlay;
