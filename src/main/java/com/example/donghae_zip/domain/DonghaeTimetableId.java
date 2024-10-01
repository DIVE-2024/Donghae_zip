package com.example.donghae_zip.domain;

import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
public class DonghaeTimetableId implements Serializable {
    private Integer trainId;
    private String stationName;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DonghaeTimetableId that = (DonghaeTimetableId) o;
        return Objects.equals(trainId, that.trainId) && Objects.equals(stationName, that.stationName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(trainId, stationName);
    }
}
