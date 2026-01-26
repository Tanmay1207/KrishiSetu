package com.project.controller;



import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.dtos.BookingRequestDTO;
import com.project.dtos.BookingResponseDTO;
import com.project.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class Bookingcontroller {

    private final BookingService bookingService;

    public Bookingcontroller(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // FARMER
    @PostMapping
    public BookingResponseDTO createBooking(
            @RequestParam Long farmerId,
            @RequestBody BookingRequestDTO dto) {
        return bookingService.createBooking(farmerId, dto);
    }

    // FARMER, OWNER
    @GetMapping("/my-bookings")
    public List<BookingResponseDTO> myBookings(
            @RequestParam Long userId,
            @RequestParam String role) {
        return bookingService.getMyBookings(userId, role);
    }

    // ALL
    @GetMapping("/{id}")
    public BookingResponseDTO getBooking(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    // OWNER, ADMIN
    @PostMapping("/{id}/return")
    public String initiateReturn(@PathVariable Long id) {
        bookingService.initiateReturn(id);
        return "Return initiated";
    }

    // ADMIN
    @PostMapping("/{id}/complete")
    public String completeBooking(@PathVariable Long id) {
        bookingService.completeBooking(id);
        return "Booking completed";
    }
}