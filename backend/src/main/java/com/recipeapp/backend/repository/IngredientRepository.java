package com.recipeapp.backend.repository;

import com.recipeapp.backend.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    List<Ingredient> findByNameIgnoreCase(String name);

}
