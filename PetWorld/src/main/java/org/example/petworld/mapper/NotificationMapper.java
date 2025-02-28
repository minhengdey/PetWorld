package org.example.petworld.mapper;

import org.example.petworld.dto.request.AdoptionRequest;
import org.example.petworld.dto.request.NotificationRequest;
import org.example.petworld.dto.response.AdoptionResponse;
import org.example.petworld.dto.response.NotificationResponse;
import org.example.petworld.entity.NotificationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NotificationMapper {
    NotificationEntity toEntity (NotificationRequest request);
    NotificationResponse toResponse (NotificationEntity entity);
}
