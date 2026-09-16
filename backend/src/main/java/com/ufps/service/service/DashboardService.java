package com.ufps.service.service;

import com.ufps.service.dto.UserDto;
import com.ufps.service.model.User;
import com.ufps.service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserDto> getLoggedUsers() {
        return userRepository.findByLoginCountGreaterThanOrderByLastLoginAtDesc(0)
                .stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    @Transactional
    public UserDto updateWelcomeMessage(User principal, String message) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado.");
        }
        if (message == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El mensaje debe ser texto.");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        user.setWelcomeMessage(message.trim());
        User updated = userRepository.save(user);

        return UserDto.fromEntity(updated);
    }
}
