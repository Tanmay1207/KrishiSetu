package com.krishisetu.backend.controller;

import com.krishisetu.backend.repository.MachineryCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/machinery")
public class MachineryController {

    @Autowired
    MachineryCategoryRepository categoryRepository;

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }
}
