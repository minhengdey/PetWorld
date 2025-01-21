package org.example.petworld.mapper;

import org.example.petworld.dto.request.PetRequest;
import org.example.petworld.dto.response.PetResponse;
import org.example.petworld.entity.PetEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetMapper {
    PetEntity toPetEntity (PetRequest request);
    PetResponse toPetResponse (PetEntity pet);
    void update (@MappingTarget PetEntity petEntity, PetRequest request);
}
