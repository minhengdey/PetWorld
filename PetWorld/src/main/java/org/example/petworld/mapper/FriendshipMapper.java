package org.example.petworld.mapper;

import org.example.petworld.dto.request.FriendshipRequest;
import org.example.petworld.dto.response.FriendshipResponse;
import org.example.petworld.entity.FriendshipEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FriendshipMapper {
    FriendshipEntity toEntity (FriendshipRequest request);
    FriendshipResponse toResponse (FriendshipEntity friendship);
    void update (@MappingTarget FriendshipEntity friendshipEntity, FriendshipRequest request);
}
