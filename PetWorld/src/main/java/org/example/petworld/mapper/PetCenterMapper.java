package org.example.petworld.mapper;

import org.example.petworld.dto.request.PetCenterRequest;
import org.example.petworld.dto.request.PetOwnerRequest;
import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.PetCenterResponse;
import org.example.petworld.dto.response.PetOwnerResponse;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.example.petworld.entity.UsersEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetCenterMapper {
    PetCenterEntity toPetCenterEntity (UserCreationRequest request);
    PetCenterEntity toPetCenterEntity (UsersEntity users);
    PetCenterResponse toPetCenterResponse (PetCenterEntity petCenter);
    UserResponse toUserResponse (PetCenterEntity petCenter);
    void update (@MappingTarget PetCenterEntity petCenter, PetCenterRequest request);
}
