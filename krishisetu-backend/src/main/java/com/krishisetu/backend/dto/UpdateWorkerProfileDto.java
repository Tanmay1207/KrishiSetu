package com.krishisetu.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateWorkerProfileDto {
    private String skills;
    private int experienceYears;
    private double hourlyRate;
    private String bio;
    private LocalDate availableDate;
}
