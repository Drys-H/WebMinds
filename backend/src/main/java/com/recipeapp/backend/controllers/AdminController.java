package com.recipeapp.backend.controllers;

import com.recipeapp.backend.service.CommentService;
import com.recipeapp.backend.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RecipeService recipeService;
    private final CommentService commentService;

    public AdminController(RecipeService recipeService, CommentService commentService) {
        this.recipeService = recipeService;
        this.commentService = commentService;
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable("id") Long recipeId){

        recipeService.deleteRecipe(recipeId);
        return ResponseEntity.ok().body("Recipe Deleted");
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable("id") Long commentId) {

        commentService.deleteComment(commentId);
        return ResponseEntity.ok().body("Comment Deleted");
    }
}
