package com.recipeapp.backend.service;

import com.recipeapp.backend.dto.RegistrationFormDTO;

public interface UserService {

    void registerUser(RegistrationFormDTO registrationDTO);

}
