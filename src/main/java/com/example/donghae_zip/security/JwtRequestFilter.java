package com.example.donghae_zip.security;

import com.example.donghae_zip.util.JwtTokenUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// 모든 HTTP 요청을 가로채 JWT 토큰을 확인하고 유효한 토큰이라면 Spring Security의 SecurityContext에 사용자를 인증하는 필터
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    // JWT 토큰을 생성하고 검증하는 유틸리티 클래스 주입
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // 사용자 정보를 로드하는 서비스 클래스 주입 (UserDetailsService 인터페이스 구현체)
    @Autowired
    private UserDetailsService userDetailsService;

    // 각 요청마다 호출되는 메서드로, HTTP 요청을 가로채 JWT 토큰을 검사하고 유효성을 확인하는 역할을 함
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 요청 경로를 확인
        String requestURI = request.getRequestURI();

        // /api/restaurants/** 요청은 JWT 검증을 우회
        if (requestURI.startsWith("/api/restaurants/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Authorization 헤더에서 JWT 토큰을 가져옴 (Bearer 토큰 형태)
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Authorization 헤더가 존재하고, Bearer로 시작하는지 확인

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtTokenUtil.extractUsername(jwt);
            } catch (ExpiredJwtException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has expired");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}