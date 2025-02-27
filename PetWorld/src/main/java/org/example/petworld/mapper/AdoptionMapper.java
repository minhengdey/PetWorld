package org.example.petworld.mapper;

import org.example.petworld.dto.request.AdoptionRequest;
import org.example.petworld.dto.response.AdoptionResponse;
import org.example.petworld.entity.AdoptionEntity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AdoptionMapper {
    AdoptionEntity toEntity (AdoptionRequest request);
    AdoptionResponse toResponse (AdoptionEntity adoptionEntity);
    void update (@MappingTarget AdoptionEntity adoptionEntity, AdoptionRequest request);
}
