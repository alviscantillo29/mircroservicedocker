package com.ufps.service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Nombre es obligatorio.")
    private String name;

    @NotBlank(message = "Email es obligatorio.")
    @Email(message = "Formato de email inválido.")
    private String email;

    @NotBlank(message = "Contraseña es obligatoria.")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.")
    private String password;
}
