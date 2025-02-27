package org.example.petworld.mapper;

import org.example.petworld.dto.request.AppointmentRequest;
import org.example.petworld.dto.response.AppointmentResponse;
import org.example.petworld.entity.AppointmentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AppointmentMapper {
    AppointmentEntity toEntity (AppointmentRequest request);
    AppointmentResponse toResponse (AppointmentEntity appointmentEntity);
    void update (@MappingTarget AppointmentEntity appointmentEntity, AppointmentRequest request);
}
