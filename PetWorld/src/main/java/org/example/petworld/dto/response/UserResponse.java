package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;

    String name;

    String email;

    String phone;

    String address;

    String role;

    Date createdAt;

    Date deletedAt;

    Boolean isDeleted;

    Date updatedAt;

    String avatar;
}
