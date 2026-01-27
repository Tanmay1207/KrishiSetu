package com.krishisetu.backend.repository;

import com.krishisetu.backend.entity.MachineryCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MachineryCategoryRepository extends JpaRepository<MachineryCategory, Long> {
    Optional<MachineryCategory> findByName(String name);
}
