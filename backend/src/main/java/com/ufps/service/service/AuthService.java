package com.ufps.service.service;

import com.ufps.service.dto.AuthResponse;
import com.ufps.service.dto.LoginRequest;
import com.ufps.service.dto.RegisterRequest;
import com.ufps.service.dto.UserDto;
import com.ufps.service.model.User;
import com.ufps.service.repository.UserRepository;
import com.ufps.service.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese email.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(cleanEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .welcomeMessage("")
                .loginCount(0)
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .message("Usuario registrado con éxito.")
                .user(UserDto.fromEntity(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas.");
        }

        // Registrar el login exitoso
        user.setLoginCount((user.getLoginCount() == null ? 0 : user.getLoginCount()) + 1);
        user.setLastLoginAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        String token = tokenProvider.generateToken(updatedUser);

        return AuthResponse.builder()
                .message("Login exitoso.")
                .token(token)
                .user(UserDto.fromEntity(updatedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(User principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado.");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
        return UserDto.fromEntity(user);
    }
}
