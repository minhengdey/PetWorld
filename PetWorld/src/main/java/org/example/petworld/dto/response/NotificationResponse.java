package org.example.petworld.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.BaseUserEntity;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    Long id;

    @NotBlank
    String message;

    String path;

    Boolean isRead;

    Date createdAt;

    Date deletedAt;

    Boolean isDeleted;

    Date updatedAt;

    BaseUserEntity user;
}

