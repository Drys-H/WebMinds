package com.recipeapp.backend.controllers;

import com.recipeapp.backend.dto.CommentDTO;
import com.recipeapp.backend.dto.RecipeDTO;
import com.recipeapp.backend.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes() {

        return ResponseEntity.ok(recipeService.getAllRecipes());

    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipeById(@PathVariable Long id) {

        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @PostMapping
    public ResponseEntity<RecipeDTO> createRecipe(@RequestBody RecipeDTO recipeDTO) {

        return ResponseEntity.ok(recipeService.createRecipe(recipeDTO));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDTO>> searchRecipes(@RequestParam String keyword) {

        return ResponseEntity.ok(recipeService.searchRecipes(keyword));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsForRecipe(@PathVariable Long id) {
        // TODO: Connect to Service
        return ResponseEntity.ok(new ArrayList<>());
    }
}
