package com.example.donghae_zip.security;

import com.example.donghae_zip.domain.Member;
import com.example.donghae_zip.service.MemberService;
import com.example.donghae_zip.util.JwtTokenUtil;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final DefaultOAuth2UserService defaultOAuth2UserService = new DefaultOAuth2UserService();
    private final JwtTokenUtil jwtTokenUtil;
    private final MemberService memberService;

    public CustomOAuth2UserService(JwtTokenUtil jwtTokenUtil, MemberService memberService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.memberService = memberService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = defaultOAuth2UserService.loadUser(userRequest);

        // 소셜 로그인 제공자 구분 (google, kakao, naver 등)
        String provider = userRequest.getClientRegistration().getRegistrationId();

        // 기본 사용자 정보 변수
        String email = null;
        String providerId = null;
        String name = null;
        String nickname = null;
        String phone = null;
        String mainAttribute = "email";  // DefaultOAuth2User에 사용할 기본 식별자 필드

        // 구글 로그인 처리
        if (provider.equals("google")) {
            email = oAuth2User.getAttribute("email");
            providerId = oAuth2User.getAttribute("sub");
            name = oAuth2User.getAttribute("name");
            nickname = oAuth2User.getAttribute("given_name");
            phone = oAuth2User.getAttribute("phone_number");
        }
        // 카카오 로그인 처리
        else if (provider.equals("kakao")) {
            providerId = oAuth2User.getAttribute("id").toString();
            Map<String, Object> kakaoAccount = oAuth2User.getAttribute("kakao_account");

            if (kakaoAccount != null) {
                // 이메일 제공이 선택적이므로 이메일이 없는 경우 무작위 이메일 생성
                email = kakaoAccount.containsKey("email") ? (String) kakaoAccount.get("email") :
                        "kakao_" + UUID.randomUUID().toString().substring(0, 8) + "@kakao.com";
            }

            // 이름 정보 가져오기
            Map<String, String> properties = oAuth2User.getAttribute("properties");
            name = properties.get("nickname");
            nickname = name;  // 카카오에서 닉네임을 이름으로 사용

            // DefaultOAuth2User에 사용할 기본 식별자를 카카오의 경우 email 대신 id로 설정
            mainAttribute = "id";
        }
        // 네이버 로그인 처리
        else if (provider.equals("naver")) {
            // 네이버는 response 필드 안에 사용자 정보를 담고 있음
            Map<String, Object> response = (Map<String, Object>) oAuth2User.getAttribute("response");

            // 네이버에서 받은 사용자 정보 로그 출력
            System.out.println("Naver User Attributes: " + oAuth2User.getAttributes());

            if (response != null) {
                providerId = (String) response.get("id");
                email = (String) response.get("email");

                // 이메일이 없는 경우 임시 이메일 생성
                if (email == null || email.isEmpty()) {
                    email = "naver_" + UUID.randomUUID().toString().substring(0, 8) + "@naver.com";
                }

                name = (String) response.get("name");
                nickname = (String) response.get("nickname");
                phone = (String) response.get("mobile");  // phone 필드는 제공되지 않을 수도 있음
            }

            // mainAttribute로 'id' 설정 (네이버의 경우 id 필드 사용)
            mainAttribute = "id";

            // 사용자 저장 또는 업데이트 호출
            Member member = memberService.saveOrUpdateSocialUser(email, provider, providerId, name, nickname, phone);

            // DefaultOAuth2User 생성 시 response의 내용을 명시적으로 전달
            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                    response,  // response 속성으로 설정
                    mainAttribute  // 식별자로 사용할 속성
            );
        }


        // DB에 사용자가 없으면 새로 저장하고, 있으면 기존 사용자 반환
        Member member = memberService.saveOrUpdateSocialUser(email, provider, providerId, name, nickname, phone);

        // JWT 토큰 발급
        String token = jwtTokenUtil.generateToken(email);

        // 사용자 정보와 권한 반환 (기본 권한 "ROLE_USER")
        return new DefaultOAuth2User(
                Collections.singleton(() -> "ROLE_USER"),
                oAuth2User.getAttributes(),
                mainAttribute  // 사용자 식별자로 사용할 속성
        );
    }
}