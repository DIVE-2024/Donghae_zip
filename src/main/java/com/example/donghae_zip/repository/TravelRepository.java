package com.example.donghae_zip.repository;

import com.example.donghae_zip.domain.Member;
import com.example.donghae_zip.domain.Travel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelRepository extends JpaRepository<Travel, Long> {


    List<Travel> findByMember(Member member); // Member 기반 조회

}
