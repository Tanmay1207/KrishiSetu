package com.krishisetu.backend.controller;

import com.krishisetu.backend.dto.WorkerProfileDto;
import com.krishisetu.backend.entity.WorkerProfile;
import com.krishisetu.backend.repository.MachineryRepository;
import com.krishisetu.backend.repository.WorkerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    private MachineryRepository machineryRepository;

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

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
        List<WorkerProfile> profiles = workerProfileRepository.findByIsApprovedTrue();
        List<WorkerProfileDto> dtos = profiles.stream()
                .map(wp -> new WorkerProfileDto(
                        wp.getId(),
                        wp.getWorker().getId(),
                        wp.getWorker().getFirstName() + " " + wp.getWorker().getLastName(),
                        wp.getSkills(),
                        wp.getExperienceYears(),
                        wp.getHourlyRate(),
                        wp.getAvailabilityStatus(),
                        wp.getBio(),
                        wp.getAvailableDate(),
                        wp.isApproved()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
