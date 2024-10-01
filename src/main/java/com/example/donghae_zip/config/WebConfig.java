package com.example.donghae_zip.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// WebConfig 파일을 이용하여 전역적으로 CORS 설정을 처리.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해 CORS 설정 적용
                .allowedOrigins("http://localhost:3000", "http://localhost:8080")  // 리액트 프론트엔드 도메인 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 허용할 HTTP 메서드
                .allowedHeaders("*")  // 모든 헤더 허용
                .allowCredentials(true);  // 쿠키 등 자격 증명 허용
    }

    // RestTemplate을 스프링 빈으로 등록하는 메서드
    // RestTemplate은 다른 서비스(API)와 통신하기 위해 사용되는 스프링의 HTTP 클라이언트.
    @Bean // 스프링 컨테이너에 이 메서드가 반환하는 객체를 빈으로 등록한다.
    public RestTemplate restTemplate() {
        return new RestTemplate(); // RestTemplate 객체를 생성하여 반환한다.
    }

    // WebClient.Builder를 스프링 빈으로 등록
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}