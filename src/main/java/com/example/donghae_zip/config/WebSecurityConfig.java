package com.example.donghae_zip.config;

import com.example.donghae_zip.exception.CustomAccessDeniedHandler;
import com.example.donghae_zip.exception.CustomAuthenticationEntryPoint;
import com.example.donghae_zip.security.CustomOAuth2UserService;
import com.example.donghae_zip.security.JwtRequestFilter;
import com.example.donghae_zip.security.OAuth2SuccessHandler;
import com.example.donghae_zip.security.OAuth2FailureHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .authorizeHttpRequests(auth -> auth
                        // Swagger 및 정적 리소스 관련 경로 허용
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/favicon.ico",
                                "/error" // /error 경로 추가
                        ).permitAll()
                        // ✅ 메인 페이지 및 정적 리소스 접근 허용
                        .requestMatchers("/", "/index.html", "/static/**", "/css/**", "/js/**", "/img/**").permitAll()
                        // Health Check 경로 허용
                        .requestMatchers("/health").permitAll()
                        // 인증 없이 허용되는 API 경로들
                        .requestMatchers("/api/members/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()
                        .requestMatchers("/static/**").permitAll()
                        .requestMatchers("/api/weather/**").permitAll()
                        .requestMatchers("/api/accommodations/**").permitAll()
                        .requestMatchers("/api/restaurants/**").permitAll()
                        .requestMatchers("/api/donghae/**").permitAll()
                        .requestMatchers("/api/donghae_timetable/**").permitAll()
                        .requestMatchers("/api/station-stats/**").permitAll()
                        .requestMatchers("/api/map/coordinates/**").permitAll()
                        .requestMatchers("/api/trails/**").permitAll()
                        .requestMatchers("/api/tourist-spots/**").permitAll()
                        .requestMatchers("/api/festivals/**").permitAll()
                        .requestMatchers("/api/favorites/public/**").permitAll()
                        .requestMatchers("/api/comments/**").permitAll()

                        // 인증이 필요한 API 경로들
                        .requestMatchers("/api/favorites/auth/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/comments").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/comments/{commentId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/comments/{commentId}").authenticated()
                        .requestMatchers("/api/travel/**").authenticated()
                        .requestMatchers("/api/travel-detail/**").authenticated()

                        // 그 외의 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용 비활성화 (JWT 사용)
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login") // 로그인 페이지
                        .successHandler(oAuth2SuccessHandler)  // 소셜 로그인 성공 핸들러
                        .failureHandler(oAuth2FailureHandler)  // 소셜 로그인 실패 핸들러
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(customOAuth2UserService)) // CustomOAuth2UserService 사용
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint) // 인증 실패 시
                        .accessDeniedHandler(customAccessDeniedHandler)); // 접근 거부 시
        return http.build();
    }
}