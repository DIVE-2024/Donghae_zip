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
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Swagger 및 정적 리소스 관련 경로 허용
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api-test-swagger").permitAll()
                        .requestMatchers("/api/members/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()
                        .requestMatchers("/static/**", "/favicon.ico").permitAll()

                        // 날씨 관련 허용
                        .requestMatchers("/api/weather/**").permitAll()

                        // 숙박, 식당, 동해선 등 관련 경로 허용
                        .requestMatchers("/api/accommodations/**").permitAll()
                        .requestMatchers("/api/restaurants/**").permitAll()
                        .requestMatchers("/api/donghae/**").permitAll()
                        .requestMatchers("/api/donghae_timetable/**").permitAll()
                        .requestMatchers("/api/station-stats/**").permitAll()
                        .requestMatchers("/api/map/coordinates/**").permitAll()

                        // 둘레길, 여행지, 축제 관련 API 허용
                        .requestMatchers("/api/trails/**").permitAll()
                        .requestMatchers("/api/tourist-spots/**").permitAll()
                        .requestMatchers("/api/festivals/**").permitAll()

                        // 찜 API는 인증 필요
                        .requestMatchers("/api/favorites/auth/**").permitAll()

                        // 나이대별 인기 여행지 조회는 인증 없이 가능
                        .requestMatchers("/api/favorites/public/**").permitAll()

                        // Comment 관련 설정
                        .requestMatchers("/api/comments/**").permitAll() // 평점 조회는 인증 없이 가능
                        .requestMatchers(HttpMethod.POST, "/api/comments").permitAll() // 리뷰 작성은 인증 필요
                        .requestMatchers(HttpMethod.PUT, "/api/comments/{commentId}").permitAll() // 리뷰 수정은 인증 필요
                        .requestMatchers(HttpMethod.DELETE, "/api/comments/{commentId}").permitAll() // 리뷰 삭제는 인증 필요

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