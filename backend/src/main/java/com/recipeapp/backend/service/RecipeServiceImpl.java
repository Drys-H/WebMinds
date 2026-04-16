package com.recipeapp.backend.service;

import com.recipeapp.backend.Recipe;
import com.recipeapp.backend.User;
import com.recipeapp.backend.dto.RecipeDTO;
import com.recipeapp.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public RecipeServiceImpl(RecipeRepository recipeRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    public List<RecipeDTO> getAllRecipes() {

        List<Recipe> recipes = recipeRepository.findAll();
        return recipes.stream().map(recipe -> this.mapToDTO(recipe)).collect(Collectors.toList());

    }

    @Override
    public RecipeDTO getRecipeById(Long id) {

        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found with ID: " + id));
        return mapToDTO(recipe);

    }

    @Override
    public List<RecipeDTO> searchRecipes(String keyword) {
        List<Recipe> recipes = recipeRepository.findByTitleContainingIgnoreCaseOrDietaryTagContainingIgnoreCase(keyword, keyword);
        return recipes.stream().map(recipe -> this.mapToDTO(recipe)).collect(Collectors.toList());
    }

    @Override
    public RecipeDTO createRecipe(RecipeDTO recipeDTO) {

        User author = userRepository.findByUsername(recipeDTO.getAuthorUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + recipeDTO.getAuthorUsername()));
        Recipe recipe = new Recipe();
        recipe.setTitle(recipeDTO.getTitle());
        recipe.setPreparationSteps(recipeDTO.getPreparationSteps());
        recipe.setCookingTimeMinutes(recipeDTO.getCookingTimeMinutes());
        recipe.setServings(recipeDTO.getServings());
        recipe.setImageUrl(recipeDTO.getImageUrl());
        recipe.setCuisineType(recipeDTO.getCuisineType());
        recipe.setDietaryTag(recipeDTO.getDietaryTag());
        recipe.setAuthor(author);

        Recipe savedRecipe = recipeRepository.save(recipe);
        return mapToDTO(savedRecipe);

    }

    private RecipeDTO mapToDTO(Recipe recipe) {

        RecipeDTO dto = new RecipeDTO();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setPreparationSteps(recipe.getPreparationSteps());
        dto.setCookingTimeMinutes(recipe.getCookingTimeMinutes());
        dto.setServings(recipe.getServings());
        dto.setImageUrl(recipe.getImageUrl());
        dto.setCuisineType(recipe.getCuisineType());
        dto.setDietaryTag(recipe.getDietaryTag());
        dto.setAuthorUsername(recipe.getAuthor().getUsername());
        return dto;

    }
}
