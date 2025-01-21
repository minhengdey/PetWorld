package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.PetEntity;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendshipResponse {
    PetEntity pet1;

    PetEntity pet2;

    boolean isAccepted;

    Date createdAt;

    Date deletedAt;

    boolean isDeleted;

    Date updatedAt;
}
