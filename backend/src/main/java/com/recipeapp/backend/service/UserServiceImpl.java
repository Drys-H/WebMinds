package com.recipeapp.backend.service;

import com.recipeapp.backend.Recipe;
import com.recipeapp.backend.Role;
import com.recipeapp.backend.ShoppingList;
import com.recipeapp.backend.User;
import com.recipeapp.backend.dto.AuthResponseDTO;
import com.recipeapp.backend.dto.LoginRequestDTO;
import com.recipeapp.backend.dto.RecipeDTO;
import com.recipeapp.backend.dto.RegistrationFormDTO;
import com.recipeapp.backend.repository.RecipeRepository;
import com.recipeapp.backend.repository.ShoppingListRepository;
import com.recipeapp.backend.repository.UserRepository;
import com.recipeapp.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RecipeRepository recipeRepository;
    private final ShoppingListRepository shoppingListRepository;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService, RecipeRepository recipeRepository,
                           ShoppingListRepository shoppingListRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.recipeRepository = recipeRepository;
        this.shoppingListRepository = shoppingListRepository;
    }

    @Override
    public void registerUser(RegistrationFormDTO registrationDTO) {

        List<User> existingUsers =
                userRepository.findByUsername(registrationDTO.getUsername());

        if (!existingUsers.isEmpty()) {
            throw new RuntimeException("Username already exist!");
        }

        User newUser = new User();
        newUser.setUsername(registrationDTO.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        newUser.setEmail(registrationDTO.getEmail());
        newUser.setRole(Role.USER);
        userRepository.save(newUser);

    }

    public AuthResponseDTO loginUser(LoginRequestDTO loginRequest) {

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword()
        ));

        List<User> foundUsers = userRepository.findByUsername(loginRequest.getUsername());

        if (foundUsers.isEmpty()) {
            throw new RuntimeException("User not found!");
        }

        User user = foundUsers.get(0);
        String jwtToken = jwtService.generateToken(user);
        return new AuthResponseDTO(jwtToken);

    }

    @Override
    public void saveRecipeToProfile(String username, Long recipeId) {

        List<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = users.get(0); // Grab the first (and only) user

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found")); // This one is Optional, so it works!

        if (!user.getSavedRecipes().contains(recipe)) {
            user.getSavedRecipes().add(recipe);
            userRepository.save(user);
        }
    }

    @Override
    public void removeRecipeFromProfile(String username, Long recipeId) {

        List<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = users.get(0);

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        user.getSavedRecipes().remove(recipe);
        userRepository.save(user);
    }

    @Override
    public List<RecipeDTO> getSavedRecipes(String username) {

        List<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = users.get(0);

        return user.getSavedRecipes().stream()
                .map(recipe -> convertToDto(recipe))
                .collect(Collectors.toList());
    }

    private RecipeDTO convertToDto(Recipe recipe) {
        RecipeDTO dto = new RecipeDTO();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setPreparationSteps(recipe.getPreparationSteps());
        dto.setCookingTimeMinutes(recipe.getCookingTimeMinutes());
        dto.setServings(recipe.getServings());
        dto.setImageUrl(recipe.getImageUrl());
        dto.setCuisineType(recipe.getCuisineType());
        dto.setDietaryTag(recipe.getDietaryTag());

        if (recipe.getAuthor() != null) {
            dto.setAuthorUsername(recipe.getAuthor().getUsername());
        }

        if (recipe.getIngredients() != null) {
            List<String> ingredientStrings = recipe.getIngredients().stream()
                    .map(ingredient -> ingredient.getName())
                    .collect(Collectors.toList());
            dto.setIngredients(ingredientStrings);
        }

        return dto;
    }

    @Override
    public void addRecipeIngredientsToShoppingList(String username, Long recipeId, String tokenUsername) {

        if (!username.equals(tokenUsername)) {
            throw new RuntimeException("You are not allowed to modify another user's shopping lists.");
        }

        User user = userRepository.findByUsername(username)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        ShoppingList shoppingList = new ShoppingList();
        shoppingList.setName("Ingredients for: " + recipe.getTitle());
        shoppingList.setUser(user);
        shoppingList.getIngredients().addAll(recipe.getIngredients());

        shoppingListRepository.save(shoppingList);
    }

    @Override
    public List<ShoppingList> getShoppingLists(String username, String tokenUsername) {

        if (!username.equals(tokenUsername)) {
            throw new RuntimeException("You are not allowed to view another user's shopping lists.");
        }

        User user = userRepository.findByUsername(username)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));

        return shoppingListRepository.findByUser(user);
    }
}
