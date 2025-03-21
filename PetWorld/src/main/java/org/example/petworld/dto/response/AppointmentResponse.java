package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.ServiceEntity;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentResponse {
    Long id;

    String status;

    Date preferredDateTime;

    String specialNotes;

    Date createdAt;

    Date deletedAt;

    Date updatedAt;

    Boolean isDeleted;

    PetEntity pet;

    ServiceEntity service;
}
