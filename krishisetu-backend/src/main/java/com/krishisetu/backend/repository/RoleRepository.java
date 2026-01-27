package com.krishisetu.backend.repository;

import com.krishisetu.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}

// Separate files would be better but I'll group them for speed if allowed,
// but it's better to keep them separate. I'll do one tool call per file.
