package com.krishisetu.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/files")
public class FileController {

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        // Mock upload: Return a static Unsplash URL or any valid image URL
        // In a real app, you'd save to disk or S3 and return that URL.
        Map<String, String> response = new HashMap<>();
        response.put("url",
                "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop");
        return ResponseEntity.ok(response);
    }
}
