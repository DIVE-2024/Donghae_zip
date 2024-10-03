package com.example.donghae_zip;

import com.example.donghae_zip.config.WeatherConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties(WeatherConfig.class) // 설정 클래스 활성화
@EnableScheduling // 스케줄링 기능 활성화
public class DonghaeZipApplication {

    private static final Logger logger = LoggerFactory.getLogger(DonghaeZipApplication.class);

    public static void main(String[] args) {

        logger.trace("TRACE 로그 메세지");
        logger.debug("DEBUG 로그 메세지");
        logger.info("INFO 로그 메세지");
        logger.warn("WARN 로그 메세지");
        logger.error("ERROR 로그 메세지");

        SpringApplication.run(DonghaeZipApplication.class, args);
    }
}