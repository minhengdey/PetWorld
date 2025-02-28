package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.BaseUserEntity;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {
    Long id;

    String content;

    Boolean isRead;

    BaseUserEntity sender;

    BaseUserEntity receiver;

    Date createdAt;

    Date deletedAt;

    Boolean isDeleted;

    Date updatedAt;
}
