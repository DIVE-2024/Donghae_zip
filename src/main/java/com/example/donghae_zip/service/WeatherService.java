package com.example.donghae_zip.service;

import com.example.donghae_zip.config.WeatherConfig;
import com.example.donghae_zip.domain.Weather;
import com.example.donghae_zip.repository.WeatherRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WeatherService {

    private final WeatherRepository weatherRepository;
    private final WeatherConfig weatherConfig;

    public WeatherService(WeatherRepository weatherRepository, WeatherConfig weatherConfig) {
        this.weatherRepository = weatherRepository;
        this.weatherConfig = weatherConfig;
    }

    // 현재 날씨만 가져오는 메서드
    public void fetchAndSaveWeather(String cityName) {
        String apiKey = weatherConfig.getWeatherApiKey();
        String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?q=%s&units=metric&appid=%s",
                cityName, apiKey
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response != null) {
            // 현재 날씨 저장
            saveWeather(cityName, response, new Date());
        }
    }

    //5일간의 날씨를 가져오는 메서드
    public void fetchAndSaveWeatherForecast(String cityName) {
        String apiKey = weatherConfig.getWeatherApiKey();
        RestTemplate restTemplate = new RestTemplate();

        try {
            // 1. Geocoding API 호출
            String geoUrl = String.format(
                    "https://api.openweathermap.org/geo/1.0/direct?q=%s&limit=1&appid=%s",
                    cityName, apiKey
            );
            Map<String, Object>[] geoResponse = restTemplate.getForObject(geoUrl, Map[].class);

            if (geoResponse == null || geoResponse.length == 0) {
                System.err.println("Geocoding API returned no data for city: " + cityName);
                return;
            }

            // 경위도 추출
            double lat = (double) geoResponse[0].get("lat");
            double lon = (double) geoResponse[0].get("lon");

            // 2. 5일 예보 API 호출
            String forecastUrl = String.format(
                    "https://api.openweathermap.org/data/2.5/forecast?lat=%s&lon=%s&units=metric&appid=%s",
                    lat, lon, apiKey
            );
            Map<String, Object> forecastResponse = restTemplate.getForObject(forecastUrl, Map.class);

            if (forecastResponse != null) {
                List<Map<String, Object>> allForecasts = (List<Map<String, Object>>) forecastResponse.get("list");

                // 3. 하루 3번 데이터(00:00, 12:00, 18:00) 필터링
                List<Map<String, Object>> filteredForecasts = filterWeatherData(allForecasts);

                // 4. 필터링된 데이터 저장
                for (Map<String, Object> forecast : filteredForecasts) {
                    Date forecastDate = parseDate(forecast.get("dt_txt").toString());
                    saveOrUpdateWeather(cityName, forecast, forecastDate);
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching weather data for city " + cityName + ": " + e.getMessage());
        }
    }

    private void saveOrUpdateWeather(String cityName, Map<String, Object> weatherData, Date date) {
        // 시간 추출
        String time = "00:00:00";
        if (weatherData.get("dt_txt") != null) {
            String dateTime = weatherData.get("dt_txt").toString();
            time = dateTime.split(" ")[1];
        }

        // 기존 데이터 확인
        Optional<Weather> existingWeather = weatherRepository.findByLocationAndDateAndTime(cityName, date, java.sql.Time.valueOf(time));

        Weather weather = existingWeather.orElse(new Weather());
        weather.setLocation(cityName);
        weather.setDate(date);
        weather.setTime(java.sql.Time.valueOf(time));

        // 새로운 데이터로 업데이트
        Map<String, Object> temp = (Map<String, Object>) weatherData.get("main");
        if (temp != null) {
            weather.setTemperature(temp.get("temp") != null ? ((Number) temp.get("temp")).doubleValue() : 0.0);
            weather.setMinTemperature(temp.get("temp_min") != null ? ((Number) temp.get("temp_min")).doubleValue() : 0.0);
            weather.setMaxTemperature(temp.get("temp_max") != null ? ((Number) temp.get("temp_max")).doubleValue() : 0.0);
        }

        List<Map<String, Object>> weatherList = (List<Map<String, Object>>) weatherData.get("weather");
        if (weatherList != null && !weatherList.isEmpty()) {
            Map<String, Object> weatherDetails = weatherList.get(0);
            weather.setDescription((String) weatherDetails.getOrDefault("description", "No description available"));
            weather.setIcon((String) weatherDetails.getOrDefault("icon", ""));
        } else {
            weather.setDescription("No description available");
            weather.setIcon("");
        }

        weather.setWindSpeed(weatherData.get("wind") != null && weatherData.get("wind_speed") != null
                ? ((Number) ((Map<String, Object>) weatherData.get("wind")).get("speed")).doubleValue()
                : 0.0);
        weather.setHumidity(temp.get("humidity") != null ? ((Number) temp.get("humidity")).intValue() : 0);
        weather.setPressure(temp.get("pressure") != null ? ((Number) temp.get("pressure")).intValue() : 0);

        // 데이터 저장 또는 업데이트
        weatherRepository.save(weather);
    }



    // 특정 시간대 필터링 로직
    private List<Map<String, Object>> filterWeatherData(List<Map<String, Object>> weatherData) {
        List<String> targetTimes = Arrays.asList("00:00:00", "12:00:00", "18:00:00");

        return weatherData.stream()
                .filter(data -> {
                    String dateTime = (String) data.get("dt_txt");
                    String time = dateTime.split(" ")[1]; // "2024-11-19 12:00:00"에서 "12:00:00" 추출
                    return targetTimes.contains(time);
                })
                .collect(Collectors.toList());
    }


    // 문자열 날짜 파싱
    private Date parseDate(String dateString) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return formatter.parse(dateString);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing date: " + dateString, e);
        }
    }


    // 공통 저장 로직
    private void saveWeather(String cityName, Map<String, Object> weatherData, Date date) {
        // 시간 설정
        String time = "00:00:00";
        if (weatherData.get("dt_txt") != null) {
            String dateTime = weatherData.get("dt_txt").toString(); // "2024-11-19 12:00:00"
            time = dateTime.split(" ")[1]; // "12:00:00"
        }

        // 중복 확인
        Optional<Weather> existingWeather = weatherRepository.findByLocationAndDateAndTime(cityName, date, java.sql.Time.valueOf(time));

        Weather weather = existingWeather.orElse(new Weather());
        weather.setLocation(cityName);
        weather.setDate(date);
        weather.setTime(java.sql.Time.valueOf(time));

        // 날씨 정보 업데이트
        Map<String, Object> temp = (Map<String, Object>) weatherData.get("main");
        if (temp != null) {
            weather.setTemperature(temp.get("temp") != null ? ((Number) temp.get("temp")).doubleValue() : 0.0);
            weather.setMinTemperature(temp.get("temp_min") != null ? ((Number) temp.get("temp_min")).doubleValue() : 0.0);
            weather.setMaxTemperature(temp.get("temp_max") != null ? ((Number) temp.get("temp_max")).doubleValue() : 0.0);
        }

        List<Map<String, Object>> weatherList = (List<Map<String, Object>>) weatherData.get("weather");
        if (weatherList != null && !weatherList.isEmpty()) {
            Map<String, Object> weatherDetails = weatherList.get(0);
            weather.setDescription((String) weatherDetails.getOrDefault("description", "No description available"));
            weather.setIcon((String) weatherDetails.getOrDefault("icon", ""));
        } else {
            weather.setDescription("No description available");
            weather.setIcon("");
        }

        weather.setWindSpeed(weatherData.get("wind") != null && weatherData.get("wind_speed") != null
                ? ((Number) ((Map<String, Object>) weatherData.get("wind")).get("speed")).doubleValue()
                : 0.0);
        weather.setHumidity(temp.get("humidity") != null ? ((Number) temp.get("humidity")).intValue() : 0);
        weather.setPressure(temp.get("pressure") != null ? ((Number) temp.get("pressure")).intValue() : 0);

        // 데이터베이스에 저장 (업데이트 or 삽입)
        weatherRepository.save(weather);
    }



    // 특정 지역과 날짜 범위의 날씨 데이터 조회
    public List<Weather> getWeather(String location, Date startDate, Date endDate) {
        return weatherRepository.findByLocationAndDateBetween(location, startDate, endDate);
    }
}
