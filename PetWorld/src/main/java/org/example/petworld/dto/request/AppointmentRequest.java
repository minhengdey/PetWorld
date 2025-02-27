package org.example.petworld.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentRequest {
    Date preferredDateTime;

    Long idPet;

    String specialNotes;

    String status;
}
