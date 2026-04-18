package com.recipeapp.backend.service;

import com.recipeapp.backend.dto.CommentDTO;

import java.util.List;

public interface CommentService {

    List<CommentDTO> getCommentsForRecipe(Long recipeId);

}
