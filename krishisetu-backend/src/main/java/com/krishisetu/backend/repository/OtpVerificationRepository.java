package com.krishisetu.backend.repository;

import com.krishisetu.backend.entity.OtpVerification;
import com.krishisetu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByOtpAndUser(String otp, User user);

    Optional<OtpVerification> findByUser(User user);
}
