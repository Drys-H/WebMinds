package com.recipeapp.backend.service;

import com.recipeapp.backend.Ingredient;
import com.recipeapp.backend.Rating;
import com.recipeapp.backend.Recipe;
import com.recipeapp.backend.User;
import com.recipeapp.backend.dto.RecipeDTO;
import com.recipeapp.backend.repository.IngredientRepository;
import com.recipeapp.backend.repository.RatingRepository;
import com.recipeapp.backend.repository.RecipeRepository;
import com.recipeapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;
    private final RatingRepository ratingRepository;

    public RecipeServiceImpl(RecipeRepository recipeRepository, UserRepository userRepository, IngredientRepository ingredientRepository, RatingRepository ratingRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.ingredientRepository = ingredientRepository;
        this.ratingRepository = ratingRepository;
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
        return recipes.stream()
                .map(recipe -> this.mapToDTO(recipe))
                .collect(Collectors.toList());
    }

    @Override
    public RecipeDTO createRecipe(RecipeDTO recipeDTO) {

        List<User> foundUsers = userRepository.findByUsername(recipeDTO.getAuthorUsername());
        if (foundUsers.isEmpty()) {
            throw new RuntimeException("USER NOT FOUND: " + recipeDTO.getAuthorUsername());
        }

        User author = foundUsers.get(0);

        Recipe recipe = new Recipe();
        recipe.setTitle(recipeDTO.getTitle());
        recipe.setPreparationSteps(recipeDTO.getPreparationSteps());
        recipe.setCookingTimeMinutes(recipeDTO.getCookingTimeMinutes());
        recipe.setServings(recipeDTO.getServings());
        recipe.setImageUrl(recipeDTO.getImageUrl());
        recipe.setCuisineType(recipeDTO.getCuisineType());
        recipe.setDietaryTag(recipeDTO.getDietaryTag());
        recipe.setAuthor(author);

        List<Ingredient> recipeIngredients = new ArrayList<>();

        if (recipeDTO.getIngredients() != null) {

            for (String ingredient : recipeDTO.getIngredients()) {
                List<Ingredient> existingIngredients =
                        ingredientRepository.findByNameIgnoreCase(ingredient);
                if (existingIngredients.isEmpty()) {
                    Ingredient newIngredient = new Ingredient();
                    newIngredient.setName(ingredient);
                    recipeIngredients.add(newIngredient);
                } else {
                    recipeIngredients.add(existingIngredients.get(0));
                }
            }
        }
        recipe.setIngredients(recipeIngredients);

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

        if (recipe.getIngredients() != null) {
            List<String> ingredients = recipe.getIngredients().stream()
                    .map(ingredient -> ingredient.getName())
                    .collect(Collectors.toList());
            dto.setIngredients(ingredients);
        }
        return dto;

    }

    @Override
    public void deleteRecipe(Long recipeId) {

        if (!recipeRepository.existsById(recipeId)) {
            throw new RuntimeException("Recipe not found with ID: " + recipeId);
        }
        recipeRepository.deleteById(recipeId);
    }

    @Override
    public void addRatingToRecipe(Long recipeId, String username, int score){

        if (score < 1 || score > 5) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe with ID: " + recipeId + " not found"));

        List<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = users.get(0);

        List<Rating> existingRatings = ratingRepository.findByUserAndRecipe(user, recipe);

        Rating rating;
        if (existingRatings.isEmpty()) {
            rating = new Rating();
        } else {
            rating = existingRatings.get(0);
        }

        rating.setScore(score);
        rating.setUser(user);
        rating.setRecipe(recipe);

        ratingRepository.save(rating);

    }

    @Override
    public double getAverageRating(Long recipeId) {
        List<Rating> ratings = ratingRepository.findByRecipeId(recipeId);

        if (ratings.isEmpty()) {
            return 0.0;
        }

        double sum = 0;
        for (Rating r : ratings) {
            sum += r.getScore();
        }

        return Math.round((sum / ratings.size()) * 10.0) / 10.0;
    }

    @Override
    public void updateRecipe(Long id, RecipeDTO recipeDTO, String username) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        if (!recipe.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Only the creator is allowed to make any changes to this recipe!");
        }

        recipe.setTitle(recipeDTO.getTitle());
        recipe.setPreparationSteps(recipeDTO.getPreparationSteps());
        recipe.setCookingTimeMinutes(recipeDTO.getCookingTimeMinutes());
        recipe.setServings(recipeDTO.getServings());
        recipe.setImageUrl(recipeDTO.getImageUrl());
        recipe.setCuisineType(recipeDTO.getCuisineType());
        recipe.setDietaryTag(recipeDTO.getDietaryTag());

        if (recipeDTO.getIngredients() != null) {
            recipe.getIngredients().clear(); // Wipe the old ingredients

            for (String ingredientName : recipeDTO.getIngredients()) {
                Ingredient newIngredient = new Ingredient();
                newIngredient.setName(ingredientName);
                recipe.getIngredients().add(newIngredient);
            }
        }
        recipeRepository.save(recipe);
    }

    @Override
    public void deleteRecipe(Long id, String username) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        if (!recipe.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Only the creator is allowed to delete this recipe!");
        }
        recipeRepository.delete(recipe);
    }

}