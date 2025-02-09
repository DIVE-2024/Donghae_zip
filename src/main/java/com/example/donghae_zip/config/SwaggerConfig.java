package com.example.donghae_zip.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        String jwt = "JWT";

        // SecurityRequirement 객체는 API 문서에서 사용하는 보안 스키마를 정의합니다.
        SecurityRequirement securityRequirement = new SecurityRequirement().addList(jwt);

        // Components 객체는 보안 스키마 및 기타 API 구성 요소를 정의합니다.
        Components components = new Components().addSecuritySchemes(jwt, new SecurityScheme()
                .name(jwt)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
        );

        // 서버 URL 목록 (도메인 기반 설정 추가)
        List<Server> servers = List.of(
                new Server().url("https://donghae-zip.kro.kr").description("Production Server"),  // 도메인 기반 API
                new Server().url("http://13.209.129.85:8080").description("EC2 Server")  // 기존 EC2 IP 유지
        );

        // OpenAPI 객체 반환
        return new OpenAPI()
                .servers(servers)  // 서버 URL 리스트 추가
                .components(components)  // 보안 설정 추가
                .info(apiInfo())  // API 정보 추가
                .addSecurityItem(securityRequirement);  // 보안 요구 사항 추가
    }

    private Info apiInfo() {
        return new Info()
                .title("Donghae ZIP API")
                .description("API documentation for Donghae ZIP project")
                .version("1.0");
    }
}

