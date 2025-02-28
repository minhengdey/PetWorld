package org.example.petworld.mapper;

import org.example.petworld.dto.request.MessageRequest;
import org.example.petworld.dto.response.MessageResponse;
import org.example.petworld.entity.MessageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MessageMapper {
    MessageEntity toEntity (MessageRequest request);
    MessageResponse toResponse (MessageEntity entity);
}
