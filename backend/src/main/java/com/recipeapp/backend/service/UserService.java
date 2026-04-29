package com.recipeapp.backend.service;

import com.recipeapp.backend.ShoppingList;
import com.recipeapp.backend.dto.AuthResponseDTO;
import com.recipeapp.backend.dto.LoginRequestDTO;
import com.recipeapp.backend.dto.RecipeDTO;
import com.recipeapp.backend.dto.RegistrationFormDTO;

import java.util.List;

public interface UserService {

    void registerUser(RegistrationFormDTO registrationDTO);
    AuthResponseDTO loginUser(LoginRequestDTO loginRequest);
    void saveRecipeToProfile(String userName, Long recipeId);
    void removeRecipeFromProfile(String userName, Long recipeId);
    List<RecipeDTO> getSavedRecipes(String userName);
    void addRecipeIngredientsToShoppingList(String username, Long recipeId, String tokenUsername);
    List<ShoppingList> getShoppingLists(String username, String tokenUsername);

}
