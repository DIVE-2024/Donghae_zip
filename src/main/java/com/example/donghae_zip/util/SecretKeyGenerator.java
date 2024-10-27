package com.example.donghae_zip.util;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;

public class SecretKeyGenerator {
    public static void main(String[] args) {
        // HS512 알고리즘에 적합한 512비트 이상의 키 생성
        byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded();

        // Base64로 인코딩된 비밀 키 출력
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
        System.out.println("Generated Base64 Key: " + base64Key);
    }
}
