package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.DonghaeTimetable;
import com.example.donghae_zip.domain.TimetableInfo;
import com.example.donghae_zip.repository.DonghaeTimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class DonghaeTimetableService {

    @Autowired
    private DonghaeTimetableRepository donghaeTimetableRepository;

    // 모든 운행 시간표 가져오기
    public List<DonghaeTimetable> getAllTimetables() {
        List<DonghaeTimetable> timetables = donghaeTimetableRepository.findAll();
        System.out.println("Retrieved timetables count: " + timetables.size());
        return timetables;
    }

    // 평일 시간표 가져오기
    public List<DonghaeTimetable> getWeekdayTimetables() {
        return donghaeTimetableRepository.findByOperationDay(DonghaeTimetable.OperationDay.평일);
    }

    // 주말/휴일 시간표 가져오기
    public List<DonghaeTimetable> getWeekendTimetables() {
        return donghaeTimetableRepository.findByOperationDay(DonghaeTimetable.OperationDay.휴일);
    }

    // 특정 역의 첫차/막차 정보 가져오기
    public TimetableInfo getTimetableInfoForStation(String stationName) {
        // 역의 평일 시간표 가져오기
        List<DonghaeTimetable> weekdayTimetables = donghaeTimetableRepository.findByStationNameAndOperationDay(stationName, DonghaeTimetable.OperationDay.평일);
        // 역의 주말/휴일 시간표 가져오기
        List<DonghaeTimetable> weekendTimetables = donghaeTimetableRepository.findByStationNameAndOperationDay(stationName, DonghaeTimetable.OperationDay.휴일);

        return new TimetableInfo(
                getFirstTrain(weekdayTimetables),
                getLastTrainToNamchang(weekdayTimetables),
                getLastTrainToTaehwagang(weekdayTimetables),
                getFirstTrain(weekendTimetables),
                getLastTrainToNamchang(weekendTimetables),
                getLastTrainToTaehwagang(weekendTimetables));
    }

    // 첫차 운행 정보 찾기
    private Optional<DonghaeTimetable> getFirstTrain(List<DonghaeTimetable> timetables) {
        return timetables.stream()
                .filter(t -> "첫차운행".equals(t.getSpecialNote()))
                .min(Comparator.comparing(DonghaeTimetable::getArrivalTime));
    }

    // 남창행 막차 운행 정보 찾기
    private Optional<DonghaeTimetable> getLastTrainToNamchang(List<DonghaeTimetable> timetables) {
        return timetables.stream()
                .filter(t -> "남창행_막차운행".equals(t.getSpecialNote()))
                .max(Comparator.comparing(DonghaeTimetable::getArrivalTime));
    }

    // 종착역(태화강) 막차 운행 정보 찾기
    private Optional<DonghaeTimetable> getLastTrainToTaehwagang(List<DonghaeTimetable> timetables) {
        return timetables.stream()
                .filter(t -> "종착역_막차운행".equals(t.getSpecialNote()))
                .max(Comparator.comparing(DonghaeTimetable::getArrivalTime));
    }

}
