package com.recipeapp.backend.security;

import com.recipeapp.backend.User;
import com.recipeapp.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<User> foundUsers = userRepository.findByUsername(username);

        if (foundUsers.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return foundUsers.get(0);
    }
}
