package com.example.donghae_zip.exception;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException; // jakarta 써야 함 !!!
import java.io.IOException;

// 인증되지 않은 사용자가 접근할때 처리
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        String requestURI = request.getRequestURI();
        System.out.println("CustomAuthenticationEntryPoint called for URI: " + requestURI); // 디버깅 로그 추가

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"로그인을 하세요.\"}");
    }
}