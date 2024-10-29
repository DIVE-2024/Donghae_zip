package com.example.donghae_zip.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    // 환경 변수로부터 비밀 키를 주입 받음 (application.properties에서 설정된 값)
    @Value("${myapp.secret}")
    private String SECRET_KEY;

    // 토큰에서 사용자 이름(주로 이메일)을 추출하는 메서드
    public String extractEmail(String token) {
        // 'Claims::getSubject'를 통해 토큰의 주체(사용자)를 반환
        return extractClaim(token, Claims::getSubject);
    }

    // JwtTokenUtil에 추가
    public String extractNickname(String token) {
        return extractClaim(token, claims -> claims.get("nickname", String.class));
    }


    // 토큰에서 만료 시간을 추출하는 메서드
    public Date extractExpiration(String token) {
        // 'Claims::getExpiration'을 사용하여 토큰의 만료 시간을 반환
        return extractClaim(token, Claims::getExpiration);
    }

    // 토큰에서 특정 클레임(Claim)을 추출하는 일반적인 메서드
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        // 토큰에서 모든 클레임을 추출한 후, 전달된 함수(claimsResolver)를 사용해 필요한 클레임을 반환
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // 토큰에서 모든 클레임을 추출하는 메서드
    private Claims extractAllClaims(String token) {
        // 'SECRET_KEY'를 사용해 서명된 토큰을 파싱하고, 그 안에 포함된 클레임을 반환
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    // 토큰이 만료되었는지 확인하는 메서드
    private Boolean isTokenExpired(String token) {
        // 토큰의 만료 시간이 현재 시간 이전인지 확인해 만료 여부를 반환
        return extractExpiration(token).before(new Date());
    }

    // JWT 토큰 생성 메서드 - 이메일과 닉네임을 인자로 받음
    public String generateToken(String email, String nickname) {
        Map<String, Object> claims = new HashMap<>();
        System.out.println("generateToken 메서드 이메일: " + email);
        System.out.println("generateToken 메서드 닉네임: "+ nickname);
        claims.put("nickname", nickname); // 닉네임을 nickname 클레임에 추가
        return createToken(claims, email); // subject에는 이메일을 전달
    }

    public Map parseJwt(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getDecoder().decode(parts[1]));
            return new ObjectMapper().readValue(payload, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }



    // 클레임과 이메일을 기반으로 JWT 토큰을 생성하는 메서드
    private String createToken(Map<String, Object> claims, String subject) {
        System.out.println("createToken 메서드 claims: " + claims);
        System.out.println("createToken 메서드 subject: " +subject);
        // subject를 이메일로 설정하고 nickname은 클레임으로 추가하여 토큰 생성
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // 이메일을 subject로 설정
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10시간 유효기간 설정
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public Boolean validateToken(String token, String email) {
        // 토큰에서 subject를 추출한 후, email과 비교하여 검증
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }
}