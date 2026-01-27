package com.krishisetu.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/worker")
public class WorkerController {

    @GetMapping("/profile/mine")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<?> getMyProfile() {
        return ResponseEntity.ok(null);
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<?> getWorkerBookings() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}
