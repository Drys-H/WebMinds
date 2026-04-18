package com.recipeapp.backend.repository;

import com.recipeapp.backend.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByTitleContainingIgnoreCaseOrDietaryTagContainingIgnoreCase(String title, String dietaryTag);

}
