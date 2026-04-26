package com.recipeapp.backend.controllers;

import com.recipeapp.backend.dto.CommentDTO;
import com.recipeapp.backend.dto.CommentRequestDTO;
import com.recipeapp.backend.dto.RecipeDTO;
import com.recipeapp.backend.service.CommentService;
import com.recipeapp.backend.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeService recipeService;
    private final CommentService commentService;

    public RecipeController(RecipeService recipeService,
                            CommentService commentService) {
        this.recipeService = recipeService;
        this.commentService = commentService;
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

        return ResponseEntity.ok(commentService.getCommentsForRecipe(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long id, @RequestBody CommentRequestDTO commentDTO) {

        return ResponseEntity.ok(commentService.addComment(id, commentDTO));
    }
}
