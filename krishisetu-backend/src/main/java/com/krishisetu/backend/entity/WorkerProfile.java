package com.krishisetu.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "worker_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User worker;

    private String skills = "";
    private int experienceYears = 0;
    private double hourlyRate = 0.0;
    private String availabilityStatus = "Available";
    private String bio = "";
    private LocalDate availableDate;
    private boolean isApproved = true;
}
