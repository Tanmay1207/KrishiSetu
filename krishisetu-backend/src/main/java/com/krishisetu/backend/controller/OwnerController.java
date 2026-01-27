package com.krishisetu.backend.controller;

import com.krishisetu.backend.entity.Machinery;
import com.krishisetu.backend.entity.User;
import com.krishisetu.backend.repository.MachineryCategoryRepository;
import com.krishisetu.backend.repository.MachineryRepository;
import com.krishisetu.backend.repository.UserRepository;
import com.krishisetu.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @Autowired
    MachineryRepository machineryRepository;

    @Autowired
    MachineryCategoryRepository categoryRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/machinery/mine")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getMyMachinery() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User owner = userRepository.findById(userDetails.getId()).get();
        return ResponseEntity.ok(machineryRepository.findByOwner(owner));
    }

    @PostMapping("/machinery/list")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> listMachinery(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User owner = userRepository.findById(userDetails.getId()).get();

        Machinery machinery = new Machinery();
        machinery.setName((String) request.get("name"));
        machinery.setDescription((String) request.get("description"));
        machinery.setRatePerHour(Double.parseDouble(request.get("ratePerHour").toString()));
        machinery.setRatePerDay(Double.parseDouble(request.get("ratePerDay").toString()));
        machinery.setImageUrl((String) request.get("imageUrl"));
        if (request.get("availableDate") != null && !request.get("availableDate").toString().isEmpty()) {
            machinery.setAvailableDate(LocalDate.parse(request.get("availableDate").toString()));
        }

        Long categoryId = Long.parseLong(request.get("categoryId").toString());
        machinery.setCategory(categoryRepository.findById(categoryId).get());
        machinery.setOwner(owner);
        machinery.setApproved(false); // Requires admin approval

        machineryRepository.save(machinery);
        return ResponseEntity.ok("Machinery listed successfully! Waiting for admin approval.");
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getOwnerBookings() {
        return ResponseEntity.ok(new ArrayList<>()); // Mock for now
    }
}
