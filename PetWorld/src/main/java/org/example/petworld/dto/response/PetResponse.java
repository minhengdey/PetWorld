package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.*;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetResponse {
    Long id;

    String name;

    Date dob;

    String gender;

    String species;

    String breed;

    Float weight;

    String avatar;

    Boolean isNeutered;

    Boolean isVaccinated;

    String color;

    PetOwnerEntity petOwner;

    PetCenterEntity petCenter;

    Set<AppointmentEntity> appointments;

    Set<AdoptionEntity> adoptions;

    Set<FriendshipEntity> friendRequestSent;

    Set<FriendshipEntity> friendRequest;

    Date createdAt;

    Date deletedAt;

    Boolean isDeleted;

    String role;

    Date updatedAt;
}
