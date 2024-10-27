package com.example.donghae_zip.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // 모든 필드를 받는 생성자 자동 생성
public class MemberResponse {
    private String email;
    private String nickname;
}
