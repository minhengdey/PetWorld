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
    String status;

    Date createdAt;

    Date deletedAt;

    Date updatedAt;

    boolean isDeleted;

    PetEntity pet;

    ServiceEntity service;
}
