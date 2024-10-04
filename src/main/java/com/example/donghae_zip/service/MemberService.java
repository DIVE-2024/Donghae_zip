package com.example.donghae_zip.service;

import com.example.donghae_zip.domain.Member;
import com.example.donghae_zip.repository.MemberRepository;
import com.example.donghae_zip.security.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    // 생성자 주입 방식
    @Autowired
    public MemberService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // 전체 회원 목록 조회
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }


    // 회원가입 로직
    public Member register(Member member) {
        // 비밀번호 암호화
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        return memberRepository.save(member);
    }


    // 로그인 로직
    public Optional<Member> login(String email, String rawPassword) {
        Optional<Member> member = memberRepository.findByEmail(email);
        // 비밀번호 비교
        if (member.isPresent() && passwordEncoder.matches(rawPassword, member.get().getPassword())) {
            return member;
        }
        return Optional.empty();
    }


    // 이메일로 회원 조회 로직
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }


    // 닉네임으로 회원 조회 로직
    public Optional<Member> findByNickname(String nickname) {
        return memberRepository.findByNickname(nickname);
    }


    // 소셜 로그인 제공자와 제공자 ID로 회원 조회
    public Optional<Member> findByProviderAndProviderId(String provider, String providerId) {
        return memberRepository.findByProviderAndProviderId(provider, providerId);
    }


    // 소셜 로그인 회원 저장 또는 업데이트 로직
    public Member saveOrUpdateSocialUser(String email, String provider, String providerId, String name, String nickname, String phone) {
        logger.info("Trying to save or update social user. Email: {}, Provider: {}, ProviderId: {}", email, provider, providerId);

        // 1. 이메일로 먼저 사용자 확인
        Optional<Member> existingMemberByEmail = memberRepository.findByEmail(email);

        if (existingMemberByEmail.isPresent()) {
            // 이미 이메일로 등록된 사용자가 있으면 해당 사용자 반환
            logger.info("Member already exists with email: {}", email);
            return existingMemberByEmail.get();
        }

        // 2. 이메일이 없으면 provider와 providerId로 사용자 확인
        Optional<Member> existingMemberByProviderId = memberRepository.findByProviderAndProviderId(provider, providerId);

        if (existingMemberByProviderId.isPresent()) {
            // 이미 같은 providerId로 등록된 사용자가 있으면 해당 사용자 반환
            logger.info("Member already exists with providerId: {}", providerId);
            return existingMemberByProviderId.get();
        }

        // 3. 새로운 사용자인 경우 저장
        Member newMember = new Member();
        newMember.setEmail(email != null ? email : provider + "_" + providerId + "@example.com");
        newMember.setProvider(provider);
        newMember.setProviderId(providerId);

        // 닉네임, 전화번호, 이름 생성 (기존 로직 그대로 사용)
        String generatedNickname = (nickname != null) ? nickname : "동해선" + UUID.randomUUID().toString().substring(0, 8);
        while (memberRepository.findByNickname(generatedNickname).isPresent()) {
            generatedNickname = "동해선" + UUID.randomUUID().toString().substring(0, 8);
        }
        newMember.setNickname(generatedNickname);

        newMember.setPhone(phone != null ? phone : "000-0000-" + (int) (Math.random() * 10000));
        newMember.setName(name != null ? name : "User_" + UUID.randomUUID().toString().substring(0, 8));
        newMember.setRole(Member.Role.USER);

        // 무작위 비밀번호 생성
        String randomPassword = PasswordGenerator.generateRandomPassword();
        newMember.setPassword(passwordEncoder.encode(randomPassword));

        logger.info("Saving new member with email: {}", newMember.getEmail());
        return memberRepository.save(newMember);
    }


    // 역할 업데이트 로직
    public void updateRole(Long id, Member.Role role) {
        Optional<Member> memberOptional = memberRepository.findById(id);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            member.setRole(role);
            memberRepository.save(member);
        }
    }
}