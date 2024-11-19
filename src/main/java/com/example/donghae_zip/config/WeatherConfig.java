package com.example.donghae_zip.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "weather.api")
public class WeatherConfig {

    private String key; // application.properties에 저장된 weather.api.key를 매핑

    public String getWeatherApiKey() {
        System.out.println("Weather API Key: " + key);
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
