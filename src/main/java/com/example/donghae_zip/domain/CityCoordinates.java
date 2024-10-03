package com.example.donghae_zip.domain;

import lombok.Getter;

@Getter
public enum CityCoordinates {
    부산("부산", "98", "76"),
    울산("울산", "102", "84");

    private final String cityName;
    private final String nx;
    private final String ny;

    CityCoordinates(String cityName, String nx, String ny) {
        this.cityName = cityName;
        this.nx = nx;
        this.ny = ny;
    }

    public static CityCoordinates fromCityName(String cityName) {
        for (CityCoordinates city : CityCoordinates.values()) {
            if (city.cityName.equalsIgnoreCase(cityName)) {
                return city;
            }
        }
        throw new IllegalArgumentException("Invalid city name: " + cityName);
    }
}