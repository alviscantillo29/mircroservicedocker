package com.ufps.service.controller;

import com.ufps.service.dto.UserDto;
import com.ufps.service.dto.WelcomeMessageRequest;
import com.ufps.service.model.User;
import com.ufps.service.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/logged-users")
    public ResponseEntity<Map<String, List<UserDto>>> getLoggedUsers() {
        List<UserDto> users = dashboardService.getLoggedUsers();
        return ResponseEntity.ok(Map.of("users", users));
    }

    @PutMapping("/welcome-message")
    public ResponseEntity<Map<String, Object>> updateWelcomeMessage(
            @AuthenticationPrincipal User principal,
            @RequestBody WelcomeMessageRequest request) {
        String msg = (request != null && request.getMessage() != null) ? request.getMessage() : "";
        UserDto updatedUser = dashboardService.updateWelcomeMessage(principal, msg);

        return ResponseEntity.ok(Map.of(
                "message", "Mensaje de bienvenida guardado.",
                "user", updatedUser
        ));
    }
}
