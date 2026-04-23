package com.recipeapp.backend.service;

import com.recipeapp.backend.dto.CommentDTO;
import com.recipeapp.backend.dto.CommentRequestDTO;

import java.util.List;

public interface CommentService {

    List<CommentDTO> getCommentsForRecipe(Long recipeId);
    CommentDTO addComment(Long recipeId, CommentRequestDTO commentDTO);
    void deleteComment(Long commentId);

}
