package com.recipeapp.backend.controllers;

import com.recipeapp.backend.dto.RegistrationFormDTO;
import com.recipeapp.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegistrationFormDTO registrationDto) {

        userService.registerUser(registrationDto);
        return ResponseEntity.ok("User registered successfully");

    }
}
