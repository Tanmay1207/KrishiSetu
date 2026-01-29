package com.krishisetu.backend.controller;

import com.krishisetu.backend.service.WorkerService;
import com.krishisetu.backend.dto.UpdateWorkerProfileDto;
import com.krishisetu.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/worker")
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    @GetMapping("/profile/mine")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<?> getMyProfile() {
        // In a real app, get userId from SecurityContext
        // For now, assuming we need a way to get the current user ID.
        // Assuming the JWT filter sets the username/email in the context.
        // Let's check how other controllers get the user.
        return ResponseEntity.ok(workerService.getProfileByUserId(getCurrentUserId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateWorkerProfileDto dto) {
        boolean success = workerService.updateProfile(getCurrentUserId(), dto);
        if (!success)
            return ResponseEntity.badRequest().body("Profile not found");
        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<?> getWorkerBookings() {
        return ResponseEntity.ok(new ArrayList<>());
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) auth.getPrincipal()).getId();
        }
        return null;
    }
}
