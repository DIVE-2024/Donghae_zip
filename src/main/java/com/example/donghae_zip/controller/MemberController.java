package com.example.donghae_zip.controller;

import com.example.donghae_zip.domain.Member;
import com.example.donghae_zip.service.MemberService;
import com.example.donghae_zip.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // 전체 회원 목록 조회
    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    // 회원가입 처리
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member member) {
        try {
            Member savedMember = memberService.register(member);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);  // 201 Created 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입 실패: " + e.getMessage());
        }
    }

    // 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        Optional<Member> member = memberService.login(email, password);

        if (member.isPresent()) {
            // JWT 토큰 생성
            String token = jwtTokenUtil.generateToken(member.get().getEmail());

            // JSON 형식으로 응답
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("nickname", member.get().getNickname());
            response.put("member", member.get());

            return ResponseEntity.ok(response);  // JSON 객체로 응답
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 이메일 또는 비밀번호가 잘못되었습니다.");
        }
    }

    // JWT 토큰을 이용해 사용자 정보를 반환하는 메서드 (추가적인 엔드포인트)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        // Bearer 제거하고 토큰 값만 추출
        String jwt = token.substring(7);
        String email = jwtTokenUtil.extractUsername(jwt);

        Optional<Member> member = memberService.findByEmail(email);
        if (member.isPresent()) {
            return ResponseEntity.ok().body(member.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보를 찾을 수 없습니다.");
        }
    }

    // 로그아웃 처리(클라이언트에서 토큰 삭제하도록 안내하는 역할.)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "로그아웃 성공!");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 닉네임으로 회원 조회
    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<?> findByNickname(@PathVariable String nickname) {
        Optional<Member> member = memberService.findByNickname(nickname);
        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 닉네임의 사용자를 찾을 수 없습니다.");
        }
    }

    // 이메일로 회원 조회
    @GetMapping("/email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        Optional<Member> member = memberService.findByEmail(email);
        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 이메일의 사용자를 찾을 수 없습니다.");
        }
    }

    // 역할 업데이트 (ADMIN or USER)
    @PutMapping("/role")
    public ResponseEntity<String> updateRole(@RequestParam Long id, @RequestParam String role) {
        try {
            Member.Role updatedRole = Member.Role.valueOf(role.toUpperCase()); // Enum 값을 대소문자 구분 없이 처리
            memberService.updateRole(id, updatedRole);
            return ResponseEntity.ok("역할이 성공적으로 업데이트되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("유효하지 않은 역할 값입니다.");
        }
    }

    // 소셜 로그인 제공자 ID로 회원 조회
    @GetMapping("/provider/{provider}/{providerId}")
    public ResponseEntity<?> findByProviderId(@PathVariable String provider, @PathVariable String providerId) {
        Optional<Member> member = memberService.findByProviderAndProviderId(provider, providerId);
        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 제공자 ID의 사용자를 찾을 수 없습니다.");
        }
    }
}