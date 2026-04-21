package com.recipeapp.backend.service;

import com.recipeapp.backend.Role;
import com.recipeapp.backend.User;
import com.recipeapp.backend.dto.RegistrationFormDTO;
import com.recipeapp.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void registerUser(RegistrationFormDTO registrationDTO) {

        List<User> existingUsers =
                userRepository.findByUsername(registrationDTO.getUsername());

        if (!existingUsers.isEmpty()) {
            throw new RuntimeException("Username already exist!");
        }

        User newUser = new User();
        newUser.setUsername(registrationDTO.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        newUser.setEmail(registrationDTO.getEmail());
        newUser.setRole(Role.USER);
        userRepository.save(newUser);
    }
}
