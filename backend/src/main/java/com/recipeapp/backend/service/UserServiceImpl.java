package com.recipeapp.backend.service;

import com.recipeapp.backend.Role;
import com.recipeapp.backend.User;
import com.recipeapp.backend.dto.AuthResponseDTO;
import com.recipeapp.backend.dto.LoginRequestDTO;
import com.recipeapp.backend.dto.RegistrationFormDTO;
import com.recipeapp.backend.repository.UserRepository;
import com.recipeapp.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
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

    public AuthResponseDTO loginUser(LoginRequestDTO loginRequest) {

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword()
        ));

        List<User> foundUsers = userRepository.findByUsername(loginRequest.getUsername());

        if (foundUsers.isEmpty()) {
            throw new RuntimeException("User not found!");
        }

        User user = foundUsers.get(0);
        String jwtToken = jwtService.generateToken(user);
        return new AuthResponseDTO(jwtToken);

    }

}
