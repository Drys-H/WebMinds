package com.recipeapp.backend.service;

import com.recipeapp.backend.Comment;
import com.recipeapp.backend.dto.CommentDTO;
import com.recipeapp.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public List<CommentDTO> getCommentsForRecipe(Long recipeId) {

        List<Comment> comments = commentRepository.findByRecipeId(recipeId);

        return comments.stream()
                .map(comment -> {
                    CommentDTO commentDTO = new CommentDTO();
                    commentDTO.setId(comment.getId());
                    commentDTO.setText(comment.getText());
                    commentDTO.setRating(comment.getRating());
                    commentDTO.setAuthorUsername(comment.getUser().getUsername());
                    return commentDTO;
                })
                .collect(Collectors.toList());
    }
}
