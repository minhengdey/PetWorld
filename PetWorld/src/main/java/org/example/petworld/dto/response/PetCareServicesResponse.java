package org.example.petworld.dto.response;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.ServiceEntity;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetCareServicesResponse {
    Long id;

    String name;

    String email;

    String phone;

    String address;

    String description;

    Date createdAt;

    Date deletedAt;

    Boolean isDeleted;

    Set<ServiceEntity> services;

    Date updatedAt;

    String avatar;

    String role;
}
