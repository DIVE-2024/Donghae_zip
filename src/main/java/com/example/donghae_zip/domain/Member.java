package com.example.donghae_zip.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// @Entity: JPA에서 이 클래스가 데이터베이스의 테이블과 매핑된다는 것을 나타냄
@Entity
@Getter
@Setter
// @Table(name = "member"): 이 엔티티가 데이터베이스의 'member' 테이블과 매핑됨을 명시
@Table(name = "member")
public class Member {

    // @Id: 이 필드가 테이블의 기본 키(PK)라는 것을 나타냄
    // @GeneratedValue(strategy = GenerationType.IDENTITY): 기본 키를 자동으로 생성 (AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")  // 데이터베이스 컬럼 이름을 'user_id'로 명시
    private Long userId;

    // @Column: 해당 필드를 데이터베이스의 컬럼과 매핑 (null 허용 안 함, 최대 길이 255자)
    @Column(nullable = false, length = 255)
    private String name;

    // 이메일 필드: 고유값(unique), null 허용 안 함, 최대 길이 255자
    // @Column(unique = true): 이메일은 고유해야 하며 중복을 허용하지 않음
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    // 비밀번호 필드: null 허용 안 함, 최대 길이 255자
    // 데이터베이스의 'user_pw' 컬럼과 매핑
    @Column(name = "user_pw", nullable = false, length = 255)
    private String password;

    // 닉네임 필드: 고유값(unique), null 허용 안 함, 최대 길이 255자
    @Column(nullable = false, unique = true, length = 255)
    private String nickname;

    // 전화번호 필드: 고유값(unique), null 허용 안 함, 최대 길이 255자
    @Column(nullable = false, unique = true, length = 255)
    private String phone;

    // 나이 필드: 정수 타입 (int), null 허용 안 함
    @Column(nullable = false)
    private int age;

    // @Enumerated(EnumType.STRING): 이 필드를 enum 값으로 저장하되, 문자열로 변환하여 데이터베이스에 저장
    // 역할(Role)을 나타내는 필드로, 기본값은 'USER'
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 255)
    private Role role = Role.USER;

    // 소셜 로그인 제공자 필드: null 허용, 최대 길이 255자
    // 소셜 로그인 시 사용하는 제공자(Google, Kakao 등)를 저장
    @Column(nullable = true, length = 255)
    private String provider;

    // 소셜 로그인 제공자의 고유 ID 필드: null 허용, 최대 길이 255자
    // 각 소셜 로그인 제공자에서 사용자에게 부여한 고유 ID
    @Column(name = "providerId", nullable = true, length = 255)
    private String providerId;

    // 역할을 정의한 Enum 클래스
    public enum Role {
        ADMIN, USER  // 관리자(ADMIN)와 일반 사용자(USER)의 두 가지 역할 정의
    }
}