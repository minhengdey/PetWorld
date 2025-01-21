package org.example.petworld.mapper;

import org.example.petworld.dto.request.PetCareServicesRequest;
import org.example.petworld.dto.request.PetCenterRequest;
import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.PetCareServicesResponse;
import org.example.petworld.dto.response.PetCenterResponse;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.PetCareServicesEntity;
import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.entity.UsersEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetCareServicesMapper {
    PetCareServicesEntity toServiceEntity (UserCreationRequest request);
    PetCareServicesEntity toServiceEntity (UsersEntity users);
    UserResponse toUserResponse (PetCareServicesEntity service);
    PetCareServicesResponse toPetCareServicesResponse (PetCareServicesEntity petCenter);
    void update (@MappingTarget PetCareServicesEntity petCenter, PetCareServicesRequest request);
}
