package com.ufps.service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "Email es obligatorio.")
    private String email;

    @NotBlank(message = "Contraseña es obligatoria.")
    private String password;
}
