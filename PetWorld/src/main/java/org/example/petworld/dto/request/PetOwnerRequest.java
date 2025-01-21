package org.example.petworld.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetOwnerRequest {
    String name;

    @Email(message = "EMAIL_INVALID")
    String email;

    String phone;

    String address;

    @Size(min = 8, message = "PASSWORD_INVALID")
    String password;

    String description;
}
