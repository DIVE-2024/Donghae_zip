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

    @Value("${myapp.secret}")
    private String SECRET_KEY;

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractNickname(String token) {
        return extractClaim(token, claims -> claims.get("nickname", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String email, String nickname, String name, String provider) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        // Claims 초기화
        Map<String, Object> claims = new HashMap<>();
        claims.put("provider", provider); // 소셜 로그인 여부 확인 가능

        // 소셜 로그인 처리
        if ("kakao".equals(provider)) {
            if (name == null || name.isEmpty()) {
                throw new IllegalArgumentException("Name cannot be null or empty for Kakao login");
            }
            claims.put("name", name); // 소셜 사용자는 name 사용
        }
        // 일반 로그인 처리
        else {
            if (nickname == null || nickname.isEmpty()) {
                throw new IllegalArgumentException("Nickname cannot be null or empty for general login");
            }
            claims.put("nickname", nickname); // 일반 사용자는 nickname 사용
        }

        // 디버깅 로그 출력
        System.out.println("[JwtTokenUtil] Generating token with:");
        System.out.println(" - Email: " + email);
        System.out.println(" - Nickname: " + (nickname != null ? nickname : "N/A"));
        System.out.println(" - Name: " + (name != null ? name : "N/A"));
        System.out.println(" - Provider: " + provider);
        System.out.println(" - Claims: " + claims);

        // Token 생성
        return createToken(claims, email); // Subject는 email
    }



    public Map<String, Object> parseJwt(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getDecoder().decode(parts[1]));
            System.out.println("[JwtTokenUtil] Parsed JWT payload: " + payload);
            return new ObjectMapper().readValue(payload, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }

    private String createToken(Map<String, Object> claims, String subject) {
        if (claims == null || claims.isEmpty()) {
            throw new IllegalArgumentException("Claims cannot be null or empty");
        }
        if (subject == null || subject.isEmpty()) {
            throw new IllegalArgumentException("Subject cannot be null or empty");
        }

        // 디버깅 로그 추가
        System.out.println("[JwtTokenUtil] Creating token with:");
        System.out.println(" - Claims: " + claims);
        System.out.println(" - Subject: " + subject);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // Subject는 email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10시간 유효
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }


    public Boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        System.out.println("[JwtTokenUtil] Validating token:");
        System.out.println(" - Extracted Email: " + extractedEmail);
        System.out.println(" - Provided Email: " + email);
        System.out.println(" - Is Token Expired: " + isTokenExpired(token));
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }
}
