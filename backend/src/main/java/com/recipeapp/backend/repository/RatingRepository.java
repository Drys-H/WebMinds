package com.recipeapp.backend.repository;

import com.recipeapp.backend.Rating;
import com.recipeapp.backend.Recipe;
import com.recipeapp.backend.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRecipeId(Long recipeId);
    List<Rating> findByUserAndRecipe(User user, Recipe recipe);

}
