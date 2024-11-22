import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios for API requests
import './Overlay.css';
import Modal from "../Modal/Modal";

const Overlay = ({ closeOverlay, selectedDay }) => {
    const [activeCategory, setActiveCategory] = useState("TOURIST_SPOT"); // Active category
    const [data, setData] = useState([]); // Data for the active category
    const [currentPage, setCurrentPage] = useState(0); // Current page index
    const [totalPages, setTotalPages] = useState(0); // Total pages for pagination
    const [timeSlots, setTimeSlots] = useState([]); // Time slots (06:00 - 24:00)
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
    const [modalItem, setModalItem] = useState(null); // Item selected for the modal
    const [selectedTime, setSelectedTime] = useState("06:00"); // Selected start time
    const [duration, setDuration] = useState(1); // Selected duration in hours

    const getCategoryIcon = (category) => {
        switch (category) {
            case "식당":
                return "/image/RestaurantMarker.png";
            case "숙박/휴양":
                return "/image/AccommodaionMarker.png";
            case "여행지":
                return "/image/TouristSpotMarker.png";
            default:
                return "/image/default_image.png"; // 기본 아이콘
        }
    };

    // Initialize time slots from 06:00 to 24:00
    useEffect(() => {
        const slots = Array.from({ length: 19 }, (_, i) => ({
            time: `${String(i + 6).padStart(2, "0")}:00`,
            plans: [],
        }));
        setTimeSlots(slots);
    }, []);

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
            console.log(response.data);
            setData(response.data.content); // Set the current page's data
            setTotalPages(response.data.totalPages); // Set total pages
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const isTimeSlotAvailable = (startIndex, duration) => {
        for (let i = startIndex; i < startIndex + duration; i++) {
            if (i >= timeSlots.length || timeSlots[i].plans.length > 0 || timeSlots[i]?.reserved) {
                return false;
            }
        }
        return true;
    };
    const addItemToTimeSlot = (item, startIndex, duration) => {
        const startTime = timeSlots[startIndex].time; // 시작 시간
        const endTimeIndex = startIndex + duration; // 종료 시간 계산
        const endTime = timeSlots[endTimeIndex]?.time || "24:00"; // 종료 시간이 범위를 초과하지 않도록 설정

        if (!isTimeSlotAvailable(startIndex, duration)) {
            alert("선택한 시간대에 이미 일정이 있습니다. 다른 시간을 선택해주세요.");
            return;
        }

        // 새로운 일정 데이터 (단일 항목)
        const newPlan = {
            ...item,
            startTime,
            endTime,
        };

        setTimeSlots((prevSlots) => {
            // 이전 슬롯 복사
            const updatedSlots = [...prevSlots];

            // 시작 시간 슬롯에 중복 여부 검사 후 추가
            const currentPlans = updatedSlots[startIndex].plans;
            const isDuplicate = currentPlans.some(
                (plan) => plan.title === newPlan.title && plan.startTime === newPlan.startTime
            );

            if (!isDuplicate) {
                updatedSlots[startIndex].plans.push(newPlan); // 중복이 아닐 때만 추가
            }

            // 예약된 시간대를 표시 (중복 추가 방지용)
            for (let i = startIndex + 1; i < endTimeIndex; i++) {
                if (updatedSlots[i]) {
                    updatedSlots[i].reserved = true;
                }
            }

            return updatedSlots;
        });

        closeModal(); // 모달 닫기
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
        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
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
                            {timeSlots
                                .filter((slot) => slot.plans.length > 0) // 일정이 있는 시간대만 표시
                                .map((slot, index) => (
                                    <div key={index} className="schedule-card">
                                        {slot.plans.map((plan, idx) => (
                                            <div key={idx} className="plan-item">
                                                {/* 시작 시간 ~ 종료 시간 */}
                                                <div className="schedule-time">
                                                    {plan.startTime} ~ {plan.endTime}
                                                </div>
                                                {/* 일정 제목과 카테고리 아이콘 */}
                                                <div className="plan-content">
                                                    <img
                                                        src={getCategoryIcon(plan.category)} // 카테고리별 아이콘
                                                        alt={`${plan.category} icon`}
                                                        className="plan-icon"
                                                    />
                                                    <span className="plan-title">{plan.title || plan.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            {timeSlots.every((slot) => slot.plans.length === 0) && (
                                <div className="empty-message" style={{fontSize: "1.5rem"}}>
                                    추가된 일정이 없습니다.
                                </div>
                            )}
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
                        <div className="data-list">
                            {data.length > 0 ? (
                                data.map((item) => {
                                    console.log(item); // 데이터 확인

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
                                                <button className="data-button" onClick={() => openModal(item)}>
                                                    일정 추가
                                                </button>
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
                        {[1, 2, 3, 4].map((d) => (
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
