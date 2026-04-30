package com.recipeapp.backend.controllers;

import com.recipeapp.backend.ShoppingList;
import com.recipeapp.backend.dto.AuthResponseDTO;
import com.recipeapp.backend.dto.LoginRequestDTO;
import com.recipeapp.backend.dto.RecipeDTO;
import com.recipeapp.backend.dto.RegistrationFormDTO;
import com.recipeapp.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegistrationFormDTO registrationDto) {

        userService.registerUser(registrationDto);
        return ResponseEntity.ok("User registered successfully");

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest){

        return ResponseEntity.ok(userService.loginUser(loginRequest));

    }

    @PostMapping("/{username}/saved-recipes/{recipeId}")
    public ResponseEntity<String> saveRecipe(@PathVariable String username, @PathVariable Long recipeId) {
        userService.saveRecipeToProfile(username, recipeId);
        return ResponseEntity.ok("Recipe saved successfully!");
    }

    @DeleteMapping("/{username}/saved-recipes/{recipeId}")
    public ResponseEntity<String> removeSavedRecipe(@PathVariable String username, @PathVariable Long recipeId) {
        userService.removeRecipeFromProfile(username, recipeId);
        return ResponseEntity.ok("Recipe removed from saved list.");
    }

    @GetMapping("/{username}/saved-recipes")
    public ResponseEntity<List<RecipeDTO>> getSavedRecipes(@PathVariable String username) {
        List<RecipeDTO> savedRecipes = userService.getSavedRecipes(username);
        return ResponseEntity.ok(savedRecipes);
    }

    @PostMapping("/{username}/shopping-lists/recipe/{recipeId}")
    public ResponseEntity<String> addRecipeToShoppingList(@PathVariable String username, @PathVariable Long recipeId, Principal principal) {

        userService.addRecipeIngredientsToShoppingList(username, recipeId, principal.getName());
        return ResponseEntity.ok("New shopping list created successfully!");
    }

    @GetMapping("/{username}/shopping-lists")
    public ResponseEntity<List<ShoppingList>> getShoppingLists(
            @PathVariable String username,
            Principal principal
    ) {

        System.out.println("URL username: " + username);
        System.out.println("TOKEN username: " + principal.getName());

        List<ShoppingList> lists = userService.getShoppingLists(username, principal.getName());
        return ResponseEntity.ok(lists);
    }
}
