package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdoptionResponse {
    String status;

    PetEntity pet;

    PetOwnerEntity petOwner;

    Date createdAt;

    Date deletedAt;

    boolean isDeleted;

    Date updatedAt;
}
