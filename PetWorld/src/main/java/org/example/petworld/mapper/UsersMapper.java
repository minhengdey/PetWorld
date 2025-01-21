package org.example.petworld.mapper;

import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.UsersEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UsersMapper {
    UsersEntity toEntity (UserCreationRequest request);
    UserResponse toResponse (UsersEntity users);
    UserCreationRequest toRequest (UsersEntity users);
    void update (@MappingTarget UsersEntity users, UserCreationRequest request);
    UserResponse toUserResponse (UsersEntity users);
}
