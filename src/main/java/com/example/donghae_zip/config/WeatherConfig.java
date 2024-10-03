package com.example.donghae_zip.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "api.weather")
public class WeatherConfig {

    private String key;

    // Getter & Setter
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
