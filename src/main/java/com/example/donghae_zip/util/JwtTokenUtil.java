package com.example.donghae_zip.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    // 환경 변수로부터 비밀 키를 주입 받음 (application.properties에서 설정된 값)
    @Value("${myapp.secret}")
    private String SECRET_KEY;

    // 토큰에서 사용자 이름(주로 이메일)을 추출하는 메서드
    public String extractUsername(String token) {
        // 'Claims::getSubject'를 통해 토큰의 주체(사용자)를 반환
        return extractClaim(token, Claims::getSubject);
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

    // 사용자 이름을 기반으로 새로운 JWT 토큰을 생성하는 메서드
    public String generateToken(String username) {
        // 빈 클레임(Map)을 전달하고, 사용자 이름을 사용해 토큰을 생성
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    // 클레임과 사용자 이름을 기반으로 JWT 토큰을 생성하는 메서드
    private String createToken(Map<String, Object> claims, String subject) {
        // 클레임, 주체(사용자 이름), 발급 시간, 만료 시간을 설정하고, HS256 알고리즘과 비밀 키를 사용해 서명한 후 토큰을 반환
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10시간 유효기간 설정
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact(); // HS256 알고리즘과 비밀 키로 서명
    }

    // 토큰이 유효한지 확인하는 메서드 (사용자 이름과 만료 여부를 검증)
    public Boolean validateToken(String token, String username) {
        // 토큰에서 사용자 이름을 추출하고, 입력된 사용자 이름과 일치하며 토큰이 만료되지 않았는지 확인
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}