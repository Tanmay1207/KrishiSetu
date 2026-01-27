package com.krishisetu.backend.repository;

import com.krishisetu.backend.entity.Machinery;
import com.krishisetu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineryRepository extends JpaRepository<Machinery, Long> {
    List<Machinery> findByOwner(User owner);

    List<Machinery> findByApprovedTrue();

    List<Machinery> findByApprovedFalse();
}
