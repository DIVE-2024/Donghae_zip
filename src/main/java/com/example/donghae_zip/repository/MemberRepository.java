package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // 이메일을 기준으로 회원 조회 (로그인 시 사용)
    Optional<Member> findByEmail(String email);

    // 소셜 로그인 제공자와 제공자 ID를 기준으로 회원 조회
    Optional<Member> findByProviderAndProviderId(String provider, String providerId);

    // 닉네임으로 회원 조회
    Optional<Member> findByNickname(String nickname);
}