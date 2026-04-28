package com.recipeapp.backend.repository;

import com.recipeapp.backend.ShoppingList;
import com.recipeapp.backend.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {

    List<ShoppingList> findByUser(User user);

}
