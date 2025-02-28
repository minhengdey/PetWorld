package org.example.petworld.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.BaseUserEntity;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    @NotBlank
    String message;

    BaseUserEntity user;

    String path;
}

