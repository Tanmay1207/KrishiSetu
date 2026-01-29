package com.krishisetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileDto {
    private Long id;
    private Long workerId;
    private String workerName;
    private String skills;
    private int experienceYears;
    private double hourlyRate;
    private String availabilityStatus;
    private String bio;
    private LocalDate availableDate;
    private boolean isApproved;
}
