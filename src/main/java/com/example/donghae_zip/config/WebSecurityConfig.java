package com.example.donghae_zip.config;

import com.example.donghae_zip.exception.CustomAccessDeniedHandler;
import com.example.donghae_zip.exception.CustomAuthenticationEntryPoint;
import com.example.donghae_zip.security.CustomOAuth2UserService;
import com.example.donghae_zip.security.JwtRequestFilter;
import com.example.donghae_zip.security.OAuth2SuccessHandler;
import com.example.donghae_zip.security.OAuth2FailureHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;
    private final CustomOAuth2UserService customOAuth2UserService;

    public WebSecurityConfig(
            JwtRequestFilter jwtRequestFilter,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            CustomAccessDeniedHandler customAccessDeniedHandler,
            OAuth2SuccessHandler oAuth2SuccessHandler,
            OAuth2FailureHandler oAuth2FailureHandler,
            CustomOAuth2UserService customOAuth2UserService) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.oAuth2FailureHandler = oAuth2FailureHandler;
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api-test-swagger").permitAll()
                        .requestMatchers("/api/members/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()
                        .requestMatchers("/api/weather/**").permitAll() // 날씨 관련 허용
                        .requestMatchers("/api/accommodations/**").permitAll() // 모든 사용자가 숙박 데이터에 접근할 수 있도록 허용
                        .requestMatchers("/api/restaurants/**").permitAll() // 모든 사용자가 식당 데이터에 접근할 수 있도록 허용
                        .requestMatchers("/api/donghae/**").permitAll() // 동해선 정보에 대한 접근 허용
                        .requestMatchers("/api/donghae_timetable/**").permitAll() // 운행 시간표 접근 허용
                        .requestMatchers("/api/station-stats/**").permitAll() // 주별 승하차 인원수 접근 허용
                        .requestMatchers("/api/map/coordinates/**").permitAll() //kakao map 접근 허용
                        .requestMatchers("/static/**", "/favicon.ico").permitAll()  // 정적 리소스 허용
                        // 둘레길 관련 API 인증 없이 접근 가능
                        .requestMatchers("/api/trails/**").permitAll()
                        // 여행지 관련 API 인증 없이 접근 가능
                        .requestMatchers("/api/tourist-spots/**").permitAll()
                        // 축제 관련 API 인증 없이 접근 가능
                        .requestMatchers("/api/festivals/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login")
                        .successHandler(oAuth2SuccessHandler)  // 소셜 로그인 성공 핸들러
                        .failureHandler(oAuth2FailureHandler)  // 소셜 로그인 실패 핸들러
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)  // CustomOAuth2UserService 사용
                        )
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler)
                );
        return http.build();
    }
}