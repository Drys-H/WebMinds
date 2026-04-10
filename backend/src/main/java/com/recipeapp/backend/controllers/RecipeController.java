package com.recipeapp.backend.controllers;

import com.recipeapp.backend.dto.CommentDTO;
import com.recipeapp.backend.dto.RecipeDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes() {
        // TODO: Connect to Service
        // As we don't have a connection to the repository, returning anything for React
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipeById(@PathVariable Long id) {
        // TODO: Connect to Service
        return ResponseEntity.ok(new RecipeDTO());
    }

    @PostMapping
    public ResponseEntity<RecipeDTO> createRecipe(@RequestBody RecipeDTO recipeDto) {
        // TODO: Connect to Service
        return ResponseEntity.ok(recipeDto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDTO>> searchRecipes(@RequestParam String keyword) {
        // TODO: Connect to Service
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsForRecipe(@PathVariable Long id) {
        // TODO: Connect to Service
        return ResponseEntity.ok(new ArrayList<>());
    }
}
