package com.recipeapp.backend.service;

import com.recipeapp.backend.dto.AuthResponseDTO;
import com.recipeapp.backend.dto.LoginRequestDTO;
import com.recipeapp.backend.dto.RegistrationFormDTO;

public interface UserService {

    void registerUser(RegistrationFormDTO registrationDTO);
    AuthResponseDTO loginUser(LoginRequestDTO loginRequest);

}
