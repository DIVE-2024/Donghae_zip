package com.example.donghae_zip.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        // 실패 이유를 프론트엔드로 전달
        String errorMessage = URLEncoder.encode(exception.getMessage(), "UTF-8");

        // 실패 시 리다이렉트할 URL 설정
        String redirectUrl = "http://localhost:3000/loginFailure?error=" + errorMessage;

        // 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}