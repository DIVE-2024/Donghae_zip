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
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenUtil jwtTokenUtil;

    public OAuth2SuccessHandler(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String email = authentication.getName();
        String nickname = null;
        String name = null;
        String provider = null;

        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

            provider = request.getParameter("provider"); // Provider 정보 가져오기
            nickname = oAuth2User.getAttribute("nickname");
            name = oAuth2User.getAttribute("name");

            if (nickname == null && name != null) {
                nickname = name;
            }
        }

        if (nickname == null) nickname = "defaultNickname";
        if (name == null) name = "defaultName";
        if (provider == null) provider = "unknown";

        // JWT 생성
        String token = jwtTokenUtil.generateToken(email, nickname, name, provider);
        System.out.println("Generated JWT: " + token);

        String redirectUrl = "http://localhost:3000/loginSuccess?token=" + URLEncoder.encode(token, "UTF-8");
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

