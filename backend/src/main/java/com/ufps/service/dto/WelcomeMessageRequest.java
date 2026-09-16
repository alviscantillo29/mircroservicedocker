package com.ufps.service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WelcomeMessageRequest {

    private String message;
}
