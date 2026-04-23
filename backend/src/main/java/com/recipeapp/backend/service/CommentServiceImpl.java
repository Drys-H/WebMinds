package com.recipeapp.backend.service;

import com.recipeapp.backend.Comment;
import com.recipeapp.backend.Recipe;
import com.recipeapp.backend.User;
import com.recipeapp.backend.dto.CommentDTO;
import com.recipeapp.backend.dto.CommentRequestDTO;
import com.recipeapp.backend.repository.CommentRepository;
import com.recipeapp.backend.repository.RecipeRepository;
import com.recipeapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public CommentServiceImpl(CommentRepository commentRepository,
                              UserRepository userRepository,
                              RecipeRepository recipeRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
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

    @Override
    public CommentDTO addComment(Long recipeId, CommentRequestDTO commentDTO){

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe Not Found"));
        List<User> foundUsers = userRepository.findByUsername(commentDTO.getAuthorUsername());
        if (foundUsers.isEmpty()){
            throw new RuntimeException("User Not Found");
        }

        User author = foundUsers.get(0);
        Comment comment = new Comment();
        comment.setUser(author);
        comment.setText(commentDTO.getText());
        comment.setRating(commentDTO.getRating());
        comment.setRecipe(recipe);

        Comment savedComment = commentRepository.save(comment);
        CommentDTO responseDTO = new CommentDTO();
        responseDTO.setId(savedComment.getId());
        responseDTO.setText(savedComment.getText());
        responseDTO.setRating(savedComment.getRating());
        responseDTO.setAuthorUsername(savedComment.getUser().getUsername());
        return responseDTO;
    }

    public void deleteComment(Long commentId){
        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment Not Found" + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}
