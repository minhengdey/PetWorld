package org.example.petworld.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.BaseUserEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageRequest {
    Long id;

    String content;

    Boolean isRead;

    BaseUserEntity sender;

    BaseUserEntity receiver;
}
