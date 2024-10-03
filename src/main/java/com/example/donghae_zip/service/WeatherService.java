package com.example.donghae_zip.service;

import com.example.donghae_zip.config.WeatherConfig;
import com.example.donghae_zip.domain.CityCoordinates;
import com.example.donghae_zip.domain.Weather;
import com.example.donghae_zip.repository.WeatherRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
public class WeatherService {

    private final WeatherConfig weatherConfig;
    private final RestTemplate restTemplate;
    private final WeatherRepository weatherRepository;

    // 부산과 울산의 지역 코드
    private static final String BUSAN_REG_ID = "11H20201";
    private static final String ULSAN_REG_ID = "11H10701";


    public WeatherService(WeatherConfig weatherConfig, RestTemplate restTemplate, WeatherRepository weatherRepository) {
        this.weatherConfig = weatherConfig;
        this.restTemplate = restTemplate;
        this.weatherRepository = weatherRepository;
    }

    // 단기예보 데이터를 가져와서 시간별로 저장하는 메서드
    public Map<String, Map<String, String>> getHourlyForecastWeather(String region) {
        String baseDate = getCurrentDate();
        String baseTime = getCurrentTime(); // 현재 시간을 HHmm 형식으로 가져옴

        Map<String, Map<String, String>> hourlyWeatherData = new LinkedHashMap<>();
        String weatherData = getForecastForRegion(region, baseDate, baseTime);

        if (weatherData.contains("데이터 없음") || weatherData.equals("날씨 정보를 불러오는데 실패했습니다.")) {
            System.out.println("미래 예보 데이터가 아직 존재하지 않습니다.");
            return hourlyWeatherData;
        }

        // 시간대 배열 (단기 예보 시간대)
        String[] validTimes = {"0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300"};

        // 현재 날짜에서 0일에서 +3일(미래)까지 데이터 요청
        for (int i = 0; i <= 3; i++) {
            String fcstDate = incrementDateByDays(baseDate, i); // 현재 날짜에서 i일을 더한 날짜

            for (String time : getHourlyTimeSlots()) {
                Map<String, String> dataMap = new LinkedHashMap<>();

                // 각 시간대별 데이터를 추출 (TMP, POP 등)
                String temperature = extractDataForTime(weatherData, "TMP", fcstDate, time);
                String precipitation = extractDataForTime(weatherData, "POP", fcstDate, time);
                String skyConditionCode = extractDataForTime(weatherData, "SKY", fcstDate, time);
                String windSpeed = extractDataForTime(weatherData, "WSD", fcstDate, time);
                String rainfall = extractDataForTime(weatherData, "PCP", fcstDate, time);

                // 하늘 상태 코드 매핑
                String skyCondition = mapSkyCondition(skyConditionCode);

                // 데이터가 없는 경우 처리: 이전 시간대 데이터 사용
                if (temperature.equals("데이터 없음")) {
                    temperature = findClosestAvailableData(weatherData, "TMP", fcstDate, time, validTimes);
                }

                if (precipitation.equals("데이터 없음")) {
                    precipitation = findClosestAvailableData(weatherData, "POP", fcstDate, time, validTimes);
                }

                if (skyConditionCode.equals("데이터 없음")) {
                    skyConditionCode = findClosestAvailableData(weatherData, "SKY", fcstDate, time, validTimes);
                    skyCondition = mapSkyCondition(skyConditionCode);
                }

                if (windSpeed.equals("데이터 없음")) {
                    windSpeed = findClosestAvailableData(weatherData, "WSD", fcstDate, time, validTimes);
                }

                if (rainfall.equals("데이터 없음")) {
                    rainfall = findClosestAvailableData(weatherData, "PCP", fcstDate, time, validTimes);
                }

                dataMap.put("기온", temperature.equals("데이터 없음") ? "데이터 없음" : temperature + "°C");
                dataMap.put("강수확률", precipitation.equals("데이터 없음") ? "데이터 없음" : precipitation + "%");
                dataMap.put("하늘 상태", skyCondition);
                dataMap.put("풍속", windSpeed.equals("데이터 없음") ? "데이터 없음" : windSpeed + "m/s");
                dataMap.put("강수량", rainfall);

                // 시간대별 데이터 저장
                hourlyWeatherData.put(fcstDate + " " + time, dataMap);

                // 현재 시간 기준으로 과거 데이터는 저장하지 않음
                if (isPastDate(fcstDate, time, baseDate, baseTime)) {
                    continue;
                }

                // DB에 데이터 저장 (단기 예보는 우선적으로 저장)
                Weather existingWeather = weatherRepository.findByRegionAndForecastDateAndForecastTime(region, fcstDate, time);
                if (existingWeather == null) {
                    Weather newWeather = Weather.builder()
                            .region(region)
                            .forecastDate(fcstDate)
                            .forecastTime(time)
                            .temperature(temperature)
                            .precipitation(precipitation)
                            .skyCondition(skyCondition)
                            .windSpeed(windSpeed)
                            .rainfall(rainfall)
                            .build();
                    weatherRepository.save(newWeather);
                } else {
                    // 미래 데이터는 덮어씌움
                    existingWeather.setTemperature(temperature);
                    existingWeather.setPrecipitation(precipitation);
                    existingWeather.setSkyCondition(skyCondition);
                    existingWeather.setWindSpeed(windSpeed);
                    existingWeather.setRainfall(rainfall);
                    weatherRepository.save(existingWeather);
                }
            }
        }

        return hourlyWeatherData;
    }

    // 이전 시간대 찾기 메서드
    private String getPreviousValidTime(String currentTime, String[] validTimes) {
        for (int i = validTimes.length - 1; i >= 0; i--) {
            if (validTimes[i].compareTo(currentTime) < 0) {
                return validTimes[i];
            }
        }
        return null; // 이전 시간대가 없을 경우 null 반환
    }

    // 이전 시간대 데이터를 찾는 메서드
    private String findClosestAvailableData(String weatherData, String category, String fcstDate, String currentTime, String[] validTimes) {
        String previousTime = getPreviousValidTime(currentTime, validTimes);

        // 이전 시간대가 있을 때까지 계속 찾아감
        while (previousTime != null) {
            String data = extractDataForTime(weatherData, category, fcstDate, previousTime);
            if (!data.equals("데이터 없음")) {
                return data; // 유효한 데이터를 찾으면 반환
            }
            previousTime = getPreviousValidTime(previousTime, validTimes); // 더 이전 시간대로 이동
        }

        return "데이터 없음"; // 유효한 데이터를 찾지 못하면 기본값 반환
    }


    // 불필요한공백 및 BOM 제거

    public String removeBOM(String xmlString) {
        if (xmlString != null && xmlString.startsWith("\uFEFF")) {
            xmlString = xmlString.substring(1);
        }
        return xmlString.trim();  // 불필요한 공백도 제거
    }


    // 중기 기온 예보 API 호출 메서드
    // API 호출 메서드 (지역 코드별)
    public String getMidTermTemperature(String regionId) {
        try {
            String apiKey = weatherConfig.getKey();  // API 키 가져오기
            String tmFc = getAnnouncementTime();     // 발표 시각 계산

            // 중기 기온 예보 API URL
            String url = "http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?" +
                    "serviceKey=" + apiKey + "&regId=" + regionId + "&tmFc=" + tmFc +
                    "&numOfRows=10&dataType=XML";

            // API 호출
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
            return responseEntity.getBody();  // XML 응답 반환
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }



    public void saveTemperatureData(String xmlResponse, String region) {
        if (xmlResponse == null) {
            System.out.println(region + "의 기온 예보 데이터를 불러오는데 실패했습니다.");
            return;
        }

        try {
            // XML 파싱을 위한 DocumentBuilderFactory와 DocumentBuilder 사용
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            ByteArrayInputStream input = new ByteArrayInputStream(xmlResponse.getBytes("UTF-8"));
            Document doc = builder.parse(input);
            doc.getDocumentElement().normalize();

            // XML에서 필요한 데이터 추출
            NodeList nodeList = doc.getElementsByTagName("item");
            for (int i = 0; i < nodeList.getLength(); i++) {
                Node node = nodeList.item(i);
                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) node;

                    for (int day = 3; day <= 10; day++) {
                        String taMin = getElementTextContent(element, "taMin" + day);
                        String taMax = getElementTextContent(element, "taMax" + day);

                        // 예보 날짜를 현재 날짜로부터 몇 일 후인지를 계산
                        String forecastDate = incrementDateByDays(getCurrentDate(), day);

                        // 데이터 저장 로직
                        Weather weather = weatherRepository.findFirstByRegionAndForecastDate(region, forecastDate)
                                .orElse(new Weather());

                        weather.setRegion(region);
                        weather.setForecastDate(forecastDate);
                        weather.setLowestTemperature(taMin != null ? taMin : "데이터 없음");
                        weather.setHighestTemperature(taMax != null ? taMax : "데이터 없음");

                        weatherRepository.save(weather);  // DB에 저장
                    }
                }
            }
            System.out.println(region + " 기온 예보 데이터 저장 완료");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(region + " 기온 데이터를 파싱하는 중 오류 발생");
        }
    }


    // 발표 시각을 계산하는 메서드 (06시 또는 18시에 발표)
    private String getAnnouncementTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);

        if (hour < 6) {
            // 자정부터 6시 이전은 전날 18시 발표 데이터 사용
            calendar.add(Calendar.DATE, -1); // 하루를 뒤로 돌림
            return sdf.format(calendar.getTime()) + "1800";
        } else if (hour < 18) {
            // 6시부터 18시 이전은 당일 06시 발표 데이터 사용
            return sdf.format(calendar.getTime()) + "0600";
        } else {
            // 18시 이후는 당일 18시 발표 데이터 사용
            return sdf.format(calendar.getTime()) + "1800";
        }
    }


    // 중기 예보 데이터 갱신 메서드
    public void updateMidTermWeather(String region) {
        // 중기 예보 데이터 가져오기
        String midTermResponse = getMidTermForecast(region);
        Map<String, Map<String, String>> midTermWeatherData = parseMidTermResponse(midTermResponse);

        // 중기 기온 데이터 가져오기
        String midTermTemperatureResponse = getMidTermTemperature(region);
        Map<String, Map<String, String>> midTermTemperatureData = parseTemperatureResponse(midTermTemperatureResponse);

        // 날씨와 기온 데이터를 함께 저장
        saveMidTermWeatherAndTemperature(region, midTermWeatherData, midTermTemperatureData);
    }

    // 중기 예보 데이터를 호출하는 메서드
    public String getMidTermForecast(String region) {
        try {
            String apiKey = weatherConfig.getKey();  // API 키 가져오기
            String regId = "11H20000";  // 부산과 울산의 지역 코드 (중기 예보용)
            String tmFc = getAnnouncementTime();  // 발표 시각 계산

            // 중기 예보 API 호출 URL
            String url = "http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?" +
                    "serviceKey=" + apiKey + "&regId=" + regId + "&tmFc=" + tmFc +
                    "&numOfRows=10&dataType=JSON";

            // API 호출
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);

            // 응답 로그 출력
            System.out.println("중기예보 API 응답: " + responseEntity.getBody());

            return responseEntity.getBody();  // API 응답 본문 반환

        } catch (Exception e) {
            e.printStackTrace();
            return "날씨 정보를 불러오는데 실패했습니다.";
        }
    }


    // 중기 예보 데이터를 DB에 저장 (기온 정보 포함)
    public void saveMidTermWeatherAndTemperature(String region, Map<String, Map<String, String>> weatherData, Map<String, Map<String, String>> temperatureData) {
        try {
            String baseDate = getCurrentDate();

            for (int i = 3; i <= 10; i++) {
                String forecastDate = incrementDateByDays(baseDate, i);
                Map<String, String> weatherDetails = weatherData.get("Day" + i);
                Map<String, String> temperatureDetails = temperatureData.get("Day" + i);

                // null 체크
                if (temperatureDetails == null) {
                    System.out.println("Day " + i + " 기온 데이터가 누락되었습니다.");
                    continue;
                }

                // 엔티티에 저장
                Weather weather = weatherRepository.findFirstByRegionAndForecastDate(region, forecastDate)
                        .orElse(new Weather());

                weather.setRegion(region);
                weather.setForecastDate(forecastDate);

                // 최고/최저 기온
                weather.setHighestTemperature(temperatureDetails.get("최고기온"));
                weather.setLowestTemperature(temperatureDetails.get("최저기온"));

                // 강수 확률
                weather.setPrecipitationAm(weatherDetails != null ? weatherDetails.get("강수확률(오전)") : "0");
                weather.setPrecipitationPm(weatherDetails != null ? weatherDetails.get("강수확률(오후)") : "0");

                weatherRepository.save(weather);
            }
            System.out.println("중기 예보 데이터 저장 완료");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("중기 예보 데이터 저장 중 오류 발생");
        }
    }

    public List<Weather> getWeatherByDate(String region, String date) {
        // 주어진 지역과 날짜에 맞는 날씨 데이터를 DB에서 조회
        return weatherRepository.findByRegionAndForecastDate(region, date);
    }


    public List<Weather> getWeatherByDateRange(String region, String startDate, String endDate) {
        // 주어진 지역과 날짜 범위에 맞는 날씨 데이터를 DB에서 조회
        return weatherRepository.findByRegionAndForecastDateBetween(region, startDate, endDate);
    }



    // 기온 데이터를 가져오는 메서드

    // XML 태그에서 값을 안전하게 추출하는 메서드
    private String getElementTextContent(Element element, String tagName) {
        NodeList nodeList = element.getElementsByTagName(tagName);
        if (nodeList != null && nodeList.getLength() > 0) {
            Node node = nodeList.item(0);
            if (node != null) {
                return node.getTextContent();
            }
        }
        return null;  // 해당 태그의 데이터가 없는 경우
    }



    // 기온 데이터를 파싱하는 메서드
    // 기온 데이터를 파싱하는 메서드
    public Map<String, Map<String, String>> parseTemperatureResponse(String xmlResponse) {
        Map<String, Map<String, String>> midTermTemperatureData = new HashMap<>();
        try {
            // XML 파싱을 위한 DocumentBuilderFactory와 DocumentBuilder 사용
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            ByteArrayInputStream input = new ByteArrayInputStream(xmlResponse.getBytes("UTF-8"));
            Document doc = builder.parse(input);
            doc.getDocumentElement().normalize();

            // XML에서 필요한 데이터 추출
            NodeList nodeList = doc.getElementsByTagName("item");
            for (int i = 0; i < nodeList.getLength(); i++) {
                Node node = nodeList.item(i);
                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) node;

                    for (int day = 3; day <= 10; day++) {
                        String taMin = getElementTextContent(element, "taMin" + day);
                        String taMax = getElementTextContent(element, "taMax" + day);

                        // **변경 사항: 파싱된 값이 올바른지 로그 출력 (디버깅용)**
                        System.out.println("Day " + day + " 예상 최저기온: " + taMin + ", 예상 최고기온: " + taMax);

                        Map<String, String> temperatureDetails = new HashMap<>();
                        temperatureDetails.put("최저기온", taMin != null ? taMin : "0");
                        temperatureDetails.put("최고기온", taMax != null ? taMax : "0");

                        midTermTemperatureData.put("Day" + day, temperatureDetails);
                    }
                }
            }
            // **변경 사항: 파싱된 기온 데이터를 로그로 출력**
            System.out.println("Parsed mid-term temperature data: " + midTermTemperatureData);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("기온 데이터를 파싱하는 중 오류가 발생했습니다.");
        }

        return midTermTemperatureData;
    }






    // 현재 날짜와 시간보다 과거인지 확인하는 메서드
    private boolean isPastDate(String fcstDate, String fcstTime, String currentDate, String currentTime) {
        if (fcstDate.compareTo(currentDate) < 0) {
            return true; // 예보 날짜가 과거인 경우
        } else if (fcstDate.equals(currentDate) && fcstTime.compareTo(currentTime) < 0) {
            return true; // 예보 날짜가 오늘이고, 예보 시간이 현재 시간보다 과거인 경우
        }
        return false; // 그 외에는 과거가 아님
    }

    // 하늘 상태 코드 매핑
    private String mapSkyCondition(String skyConditionCode) {
        switch (skyConditionCode) {
            case "1":
                return "맑음";
            case "3":
                return "구름많음";
            case "4":
                return "흐림";
            default:
                return "상태 미제공"; // 기본값
        }
    }

    // 현재 날짜를 'YYYYMMDD' 형식으로 반환하는 메서드
    private String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        return sdf.format(new Date());
    }

    // 현재 시간을 HHmm 형식으로 반환하는 메서드 (발표 시간대 조정)
    private String getCurrentTime() {
        Calendar calendar = Calendar.getInstance();
        int currentHour = calendar.get(Calendar.HOUR_OF_DAY);

        if (currentHour < 2) {
            return "2300"; // 전날의 마지막 시간
        } else if (currentHour < 5) {
            return "0200";
        } else if (currentHour < 8) {
            return "0500";
        } else if (currentHour < 11) {
            return "0800";
        } else if (currentHour < 14) {
            return "1100";
        } else if (currentHour < 17) {
            return "1400";
        } else if (currentHour < 20) {
            return "1700";
        } else if (currentHour < 23) {
            return "2000";
        } else {
            return "2300"; // 자정 이후는 2300으로 설정
        }
    }

    // 1시간 단위 시간대 리스트
    private List<String> getHourlyTimeSlots() {
        List<String> timeSlots = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            timeSlots.add(String.format("%04d", hour * 100)); // 0000, 0100, ..., 2300 형식
        }
        return timeSlots;
    }

    // 날짜를 주어진 일 수만큼 증가시키는 메서드
    private String incrementDateByDays(String baseDate, int daysToAdd) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            Date date = sdf.parse(baseDate);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.DATE, daysToAdd); // 주어진 일 수 만큼 더함
            return sdf.format(calendar.getTime());
        } catch (Exception e) {
            e.printStackTrace();
            return baseDate; // 오류 시 기본 날짜 반환
        }
    }

    // 단기예보 데이터를 가져오는 메서드
    public String getForecastForRegion(String region, String baseDate, String baseTime) {
        try {
            CityCoordinates coordinates = CityCoordinates.fromCityName(region);
            String nx = coordinates.getNx();
            String ny = coordinates.getNy();
            String apiKey = weatherConfig.getKey();

            // API 호출 URL 생성
            String url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?" +
                    "serviceKey=" + apiKey + "&pageNo=1&numOfRows=1000&dataType=JSON" +
                    "&base_date=" + baseDate + "&base_time=" + baseTime +  // base_time은 발표 시간대
                    "&nx=" + nx + "&ny=" + ny;

            ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
            String responseBody = responseEntity.getBody();

            // 응답 데이터 확인
            System.out.println("API 응답: " + responseBody);

            if (responseBody != null && responseBody.startsWith("<")) {
                return "API 응답이 HTML 형식입니다. 요청 또는 서비스 키를 확인하세요.";
            }

            return responseBody;
        } catch (Exception e) {
            e.printStackTrace();
            return "날씨 정보를 불러오는데 실패했습니다.";
        }
    }

    private String extractDataForTime(String weatherData, String category, String fcstDate, String fcstTime) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            // JSON 형식인지 확인
            if (weatherData != null && weatherData.startsWith("<")) {
                System.out.println("API 응답이 JSON 형식이 아닙니다: " + weatherData);
                return "데이터 없음";
            }

            JsonNode root = mapper.readTree(weatherData);
            JsonNode items = root.path("response").path("body").path("items").path("item");

            for (JsonNode item : items) {
                String itemCategory = item.path("category").asText();
                String itemDate = item.path("fcstDate").asText();
                String itemTime = item.path("fcstTime").asText();

                if (itemCategory.equals(category) && itemDate.equals(fcstDate) && itemTime.equals(fcstTime)) {
                    return item.path("fcstValue").asText();
                }
            }
            return "데이터 없음";  // 해당 카테고리나 시간대의 데이터가 없는 경우 기본값 반환
        } catch (Exception e) {
            e.printStackTrace();
            return "데이터 파싱 실패";
        }
    }


    // 중기 예보 데이터를 파싱하는 메서드
    public Map<String, Map<String, String>> parseMidTermResponse(String jsonResponse) {
        Map<String, Map<String, String>> midTermWeatherData = new HashMap<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);
            JsonNode items = root.path("response").path("body").path("items").path("item").get(0);

            // 3일 후 ~ 10일 후 데이터를 파싱하기 위한 반복문
            for (int i = 3; i <= 10; i++) {
                String rainProbabilityAm = "";
                String rainProbabilityPm = "";
                String weatherAm = "";
                String weatherPm = "";

                // 3일부터 7일까지는 Am/Pm 구분
                if (i <= 7) {
                    rainProbabilityAm = items.path("rnSt" + i + "Am").asText();
                    rainProbabilityPm = items.path("rnSt" + i + "Pm").asText();
                    weatherAm = items.path("wf" + i + "Am").asText();
                    weatherPm = items.path("wf" + i + "Pm").asText();
                } else {
                    // 8일 이후부터는 Am/Pm 구분이 없고 하나의 필드만 제공
                    rainProbabilityAm = items.path("rnSt" + i).asText();
                    weatherAm = items.path("wf" + i).asText();
                }

                Map<String, String> weatherDetails = new HashMap<>();
                weatherDetails.put("오전 날씨", weatherAm);
                weatherDetails.put("오후 날씨", weatherPm.isEmpty() ? weatherAm : weatherPm);  // 오전/오후가 동일할 경우 하나의 값 사용
                weatherDetails.put("강수확률(오전)", rainProbabilityAm);
                weatherDetails.put("강수확률(오후)", rainProbabilityPm.isEmpty() ? rainProbabilityAm : rainProbabilityPm);  // 오전/오후가 동일할 경우 하나의 값 사용

                midTermWeatherData.put("Day" + i, weatherDetails);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return midTermWeatherData;
    }
}