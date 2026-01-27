package com.krishisetu.backend.service;

import com.krishisetu.backend.entity.OtpVerification;
import com.krishisetu.backend.entity.Role;
import com.krishisetu.backend.entity.User;
import com.krishisetu.backend.repository.OtpVerificationRepository;
import com.krishisetu.backend.repository.RoleRepository;
import com.krishisetu.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public User registerUser(String firstName, String lastName, String email, String password, String roleName) {
        User user = createUserEntity(firstName, lastName, email, password, roleName);
        user.setEnabled(false);
        user.setApproved(false);
        User savedUser = userRepository.save(user);
        generateAndSendOtp(savedUser);
        return savedUser;
    }

    @Transactional
    public User registerAdminDirectly(String firstName, String lastName, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }

        User user = createUserEntity(firstName, lastName, email, password, "ROLE_ADMIN");
        user.setEnabled(true);
        user.setApproved(true);
        return userRepository.save(user);
    }

    private User createUserEntity(String firstName, String lastName, String email, String password, String roleName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));

        // Map frontend roles to DB roles
        String dbRole = roleName;
        if (roleName.equals("Farmer") || roleName.equals("ROLE_FARMER"))
            dbRole = "ROLE_FARMER";
        else if (roleName.equals("MachineryOwner") || roleName.equals("ROLE_OWNER"))
            dbRole = "ROLE_OWNER";
        else if (roleName.equals("FarmWorker") || roleName.equals("ROLE_WORKER"))
            dbRole = "ROLE_WORKER";
        else if (roleName.equals("ROLE_USER"))
            dbRole = "ROLE_USER";
        else if (roleName.equals("ROLE_ADMIN"))
            dbRole = "ROLE_ADMIN";
        else if (roleName.equals("ROLE_SUPER_ADMIN"))
            dbRole = "ROLE_SUPER_ADMIN";

        Set<Role> roles = new HashSet<>();
        String finalDbRole = dbRole;
        Role userRole = roleRepository.findByName(finalDbRole)
                .orElseThrow(() -> new RuntimeException("Error: Role " + finalDbRole + " is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        return user;
    }

    private void generateAndSendOtp(User user) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpVerification otpVerification = otpRepository.findByUser(user).orElse(new OtpVerification());
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpVerification.setUser(user);

        otpRepository.save(otpVerification);

        // In a real scenario, you'd send the email here.
        // For testing, we might just log it or use a real SMTP if configured.
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            System.out.println("OTP for user " + user.getEmail() + " is: " + otp);
        }
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        OtpVerification otpVerification = otpRepository.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setEnabled(true);
        userRepository.save(user);
        otpRepository.delete(otpVerification);
        return true;
    }
}
