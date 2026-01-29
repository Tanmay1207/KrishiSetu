package com.krishisetu.backend.service;

import com.krishisetu.backend.dto.UpdateWorkerProfileDto;
import com.krishisetu.backend.dto.WorkerProfileDto;
import com.krishisetu.backend.entity.User;
import com.krishisetu.backend.entity.WorkerProfile;
import com.krishisetu.backend.repository.UserRepository;
import com.krishisetu.backend.repository.WorkerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkerService {

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkerProfileDto getProfileByUserId(Long userId) {
        WorkerProfile wp = workerProfileRepository.findByWorkerId(userId).orElse(null);
        if (wp == null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null)
                return null;
            return new WorkerProfileDto(
                    null,
                    user.getId(),
                    user.getFirstName() + " " + user.getLastName(),
                    "", 0, 0.0, "Available", "", null, true);
        }
        return new WorkerProfileDto(
                wp.getId(),
                wp.getWorker().getId(),
                wp.getWorker().getFirstName() + " " + wp.getWorker().getLastName(),
                wp.getSkills(),
                wp.getExperienceYears(),
                wp.getHourlyRate(),
                wp.getAvailabilityStatus(),
                wp.getBio(),
                wp.getAvailableDate(),
                wp.isApproved());
    }

    @Transactional
    public boolean updateProfile(Long userId, UpdateWorkerProfileDto dto) {
        WorkerProfile profile = workerProfileRepository.findByWorkerId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElse(null);
                    if (user == null)
                        return null;
                    WorkerProfile newProfile = new WorkerProfile();
                    newProfile.setWorker(user);
                    return workerProfileRepository.save(newProfile);
                });

        if (profile == null) {
            return false;
        }

        boolean dateChanged = (profile.getAvailableDate() == null && dto.getAvailableDate() != null) ||
                (profile.getAvailableDate() != null && !profile.getAvailableDate().equals(dto.getAvailableDate()));

        profile.setSkills(dto.getSkills());
        profile.setExperienceYears(dto.getExperienceYears());
        profile.setHourlyRate(dto.getHourlyRate());
        profile.setBio(dto.getBio());
        profile.setAvailableDate(dto.getAvailableDate());

        if (dateChanged && dto.getAvailableDate() != null) {
            profile.setAvailabilityStatus("Available");
        }

        workerProfileRepository.save(profile);
        return true;
    }

    @Transactional
    public void createProfileForUser(User user) {
        if (workerProfileRepository.findByWorkerId(user.getId()).isEmpty()) {
            WorkerProfile profile = new WorkerProfile();
            profile.setWorker(user);
            workerProfileRepository.save(profile);
        }
    }
}
