package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.AdoptionEntity;
import org.example.petworld.entity.PetEntity;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetCenterResponse {
    String name;

    String email;

    String phone;

    String address;

    String role;

    String description;

    Date createdAt;

    Date deletedAt;

    Date updatedAt;

    boolean isDeleted;

    Set<PetEntity> petsAvailable;

    String avatar;
}
