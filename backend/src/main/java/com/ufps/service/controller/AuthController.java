package com.ufps.service.controller;

import com.ufps.service.dto.AuthResponse;
import com.ufps.service.dto.LoginRequest;
import com.ufps.service.dto.RegisterRequest;
import com.ufps.service.dto.UserDto;
import com.ufps.service.model.User;
import com.ufps.service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, UserDto>> me(@AuthenticationPrincipal User principal) {
        UserDto user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(Map.of("user", user));
    }
}
