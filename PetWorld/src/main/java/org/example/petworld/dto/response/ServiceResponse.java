package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.AppointmentEntity;
import org.example.petworld.entity.PetCareServicesEntity;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResponse {
    Long id;

    String name;

    Integer price;

    Integer usedCount;

    String discount;

    Date createdAt;

    Date deletedAt;

    Boolean isDeleted;

    Date updatedAt;

    Set<AppointmentEntity> appointments;

    PetCareServicesEntity petCareServices;
}
