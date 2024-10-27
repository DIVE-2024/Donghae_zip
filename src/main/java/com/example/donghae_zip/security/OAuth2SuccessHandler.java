package com.example.donghae_zip.security;

import com.example.donghae_zip.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;

@Component
public class    OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenUtil jwtTokenUtil;

    public OAuth2SuccessHandler(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String email = authentication.getName();

        String nickname = null;
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

            // 제공자가 nickname을 "nickname"으로 제공하지 않을 경우 대비해 다른 속성도 확인
            nickname = oAuth2User.getAttribute("nickname");
            if (nickname == null) {
                nickname = oAuth2User.getAttribute("name");  // name 속성으로 대체 가능
            }
        }

        if (nickname == null) {
            nickname = "defaultNickname";  // 닉네임이 없을 경우 기본값
        }

        // JWT 토큰 생성
        String token = jwtTokenUtil.generateToken(email, nickname);
        System.out.println("Generated JWT: " + token);

        // 디코딩하여 subject와 nickname 확인
        Map<String, Object> decodedJwt = jwtTokenUtil.parseJwt(token);
        System.out.println("Decoded JWT: " + decodedJwt);

        // 리다이렉트 URL에 JWT 토큰을 포함 (프론트엔드로 전달)
        String redirectUrl = "http://localhost:3000/loginSuccess?token=" + URLEncoder.encode(token, "UTF-8");
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

}