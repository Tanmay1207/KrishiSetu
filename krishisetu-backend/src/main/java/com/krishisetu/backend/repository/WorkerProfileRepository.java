package com.krishisetu.backend.repository;

import com.krishisetu.backend.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    Optional<WorkerProfile> findByWorkerId(Long workerId);

    java.util.List<WorkerProfile> findByIsApprovedTrue();
}
