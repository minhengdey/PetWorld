package org.example.petworld.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetRequest {
    String name;

    Date dob;

    String gender;

    String species;

    String breed;

    float weight;

    String pathProfileImage;
}
