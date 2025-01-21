package org.example.petworld.mapper;

import org.example.petworld.dto.request.PetOwnerRequest;
import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.PetOwnerResponse;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.PetOwnerEntity;
import org.example.petworld.entity.UsersEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetOwnerMapper {
    PetOwnerEntity toPetOwnerEntity (UserCreationRequest request);
    PetOwnerEntity toPetOwnerEntity (UsersEntity users);
    PetOwnerResponse toPetOwnerResponse (PetOwnerEntity petOwner);
    UserResponse toUserResponse (PetOwnerEntity petOwner);
    void update (@MappingTarget PetOwnerEntity petOwnerEntity, PetOwnerRequest request);
}
