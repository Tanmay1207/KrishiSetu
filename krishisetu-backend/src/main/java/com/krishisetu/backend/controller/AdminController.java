package com.krishisetu.backend.controller;

import com.krishisetu.backend.dto.MessageResponse;
import com.krishisetu.backend.entity.Machinery;
import com.krishisetu.backend.entity.User;
import com.krishisetu.backend.repository.MachineryRepository;
import com.krishisetu.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    MachineryRepository machineryRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalFarmers", userRepository.count(),
                "totalMachineryOwners", userRepository.count(), // Should filter by role later
                "totalMachineryListings", machineryRepository.count()));
    }

    @PostMapping("/users/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> approveUser(@PathVariable Long id, @RequestParam boolean approve) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (approve) {
            user.setApproved(true);
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("User approved successfully!"));
        } else {
            userRepository.delete(user);
            return ResponseEntity.ok(new MessageResponse("User registration rejected and account deleted."));
        }
    }

    @GetMapping("/machinery/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getPendingMachinery() {
        return ResponseEntity.ok(machineryRepository.findByApprovedFalse());
    }

    @PostMapping("/machinery/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> approveMachinery(@PathVariable Long id, @RequestParam boolean approve) {
        Machinery machinery = machineryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Machinery not found."));

        if (approve) {
            machinery.setApproved(true);
            machineryRepository.save(machinery);
            return ResponseEntity.ok(new MessageResponse("Machinery approved successfully!"));
        } else {
            machineryRepository.delete(machinery);
            return ResponseEntity.ok(new MessageResponse("Machinery listing rejected and removed."));
        }
    }
}
