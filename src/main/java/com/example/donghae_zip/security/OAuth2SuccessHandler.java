package com.example.donghae_zip.security;

import com.example.donghae_zip.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
public class    OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenUtil jwtTokenUtil;

    public OAuth2SuccessHandler(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // OAuth2 로그인 후 사용자 정보에서 이메일을 가져옴
        String email = authentication.getName();

        // JWT 토큰 생성
        String token = jwtTokenUtil.generateToken(email);

        // 리다이렉트 URL에 JWT 토큰을 포함 (프론트엔드로 전달)
        String redirectUrl = "http://localhost:3000/loginSuccess?token=" + URLEncoder.encode(token, "UTF-8");
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}