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

        // Authorization 헤더에서 JWT 토큰을 가져옴 (Bearer 토큰 형태)
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;  // 토큰에서 추출한 사용자 이름(이메일)
        String jwt = null;  // JWT 토큰

        // Authorization 헤더가 존재하고, Bearer로 시작하는지 확인
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // "Bearer " 이후의 실제 JWT 토큰 부분만 추출
            jwt = authorizationHeader.substring(7);
            // JWT 토큰에서 사용자 이름(이메일)을 추출
            try {
                username = jwtTokenUtil.extractUsername(jwt);
            } catch (ExpiredJwtException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has expired");
                return;  // 토큰이 만료되면 요청을 더 이상 처리하지 않음
            }
        }

        // 사용자의 이름이 존재하고, 해당 요청에 대해 인증 정보가 없는 경우에만 실행
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 사용자 이름을 이용해 사용자 정보를 데이터베이스에서 로드 (UserDetails 객체로 반환)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // JWT 토큰이 유효한지 확인
            if (jwtTokenUtil.validateToken(jwt, userDetails.getUsername())) {
                // 사용자의 인증 정보를 생성 (비밀번호는 null로 처리)
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                // 요청의 세부 정보를 설정 (IP 주소, 세션 ID 등)
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // 스프링 시큐리티의 SecurityContextHolder에 인증 정보를 설정
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        // 필터 체인의 다음 필터로 요청을 넘김 (다음 필터 또는 최종 목적지로 요청 전달)
        filterChain.doFilter(request, response);
    }
}