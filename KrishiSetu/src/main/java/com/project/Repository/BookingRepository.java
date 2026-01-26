package com.project.Repository;




import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Entity.Booking;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByFarmerId(Long farmerId);

    List<Booking> findByOwnerId(Long ownerId);
}