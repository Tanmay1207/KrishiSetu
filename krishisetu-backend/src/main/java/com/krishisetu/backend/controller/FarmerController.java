package com.krishisetu.backend.controller;

import com.krishisetu.backend.repository.MachineryRepository;
import com.krishisetu.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    MachineryRepository machineryRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/machinery/search")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> searchMachinery() {
        return ResponseEntity.ok(machineryRepository.findByApprovedTrue());
    }

    @GetMapping("/bookings/history")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> getBookingHistory() {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/workers/search")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> searchWorkers() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}
