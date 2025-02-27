package org.example.petworld.mapper;

import org.example.petworld.dto.request.ServiceRequest;
import org.example.petworld.dto.response.ServiceResponse;
import org.example.petworld.entity.ServiceEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServiceMapper {
    ServiceEntity toEntity (ServiceRequest request);
    ServiceResponse toResponse (ServiceEntity service);
    void update (@MappingTarget ServiceEntity service, ServiceRequest request);
}
