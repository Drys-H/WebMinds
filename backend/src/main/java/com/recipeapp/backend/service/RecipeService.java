package com.recipeapp.backend.service;

import com.recipeapp.backend.Recipe;
import com.recipeapp.backend.dto.RecipeDTO;

import java.util.List;

public interface RecipeService {

    List<RecipeDTO> getAllRecipes();
    RecipeDTO getRecipeById(Long id);
    RecipeDTO createRecipe(RecipeDTO recipeDTO);
    List<RecipeDTO> searchRecipes(String keyword);
    void deleteRecipe(Long recipeId);
    void addRatingToRecipe(Long recipeId, String username, int score);
    double getAverageRating(Long recipeId);

}
