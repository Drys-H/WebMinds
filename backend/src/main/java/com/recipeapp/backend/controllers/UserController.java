package com.recipeapp.backend.controllers;

import com.recipeapp.backend.dto.RegistrationFormDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegistrationFormDTO registrationDto) {
        // TODO: Connect to Service and Database
        return ResponseEntity.ok("User registration endpoint reached successfully for: " + registrationDto.getUsername());
    }
}
