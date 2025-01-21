package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.*;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetResponse {
    String name;

    Date dob;

    String gender;

    String species;

    String breed;

    float weight;

    String pathProfileImage;

    PetOwnerEntity petOwner;

    PetCenterEntity petCenter;

    Set<AppointmentEntity> appointments;

    Set<AdoptionEntity> adoptions;

    Set<FriendshipEntity> friendRequestSent;

    Set<FriendshipEntity> friendRequest;

    Date createdAt;

    Date deletedAt;

    boolean isDeleted;

    String role;

    Date updatedAt;
}
