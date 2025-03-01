package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.MessageRequest;
import org.example.petworld.dto.response.MessageResponse;
import org.example.petworld.entity.MessageEntity;
import org.example.petworld.mapper.MessageMapper;
import org.example.petworld.repository.MessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageService {
    MessageRepository messageRepository;
    MessageMapper messageMapper;
    SimpMessagingTemplate messagingTemplate;

    public MessageResponse sendMessage(MessageRequest request) {
        MessageEntity messageEntity = messageMapper.toEntity(request);
        messageEntity.setIsRead(false);
        messageEntity.setCreatedAt(new Date());
        messageEntity.setIsDeleted(false);
        messagingTemplate.convertAndSendToUser(
                request.getSender().getId().toString(),
                "/queue/messages",
                messageMapper.toResponse(messageRepository.save(messageEntity))
        );

        return messageMapper.toResponse(messageEntity);
    }

    public List<MessageResponse> getMessagesBetweenUsers(Long userId, Long contactId) {
        List<MessageEntity> messages = messageRepository.findAllByIsDeleted(false);
        List<MessageResponse> list = new ArrayList<>();
        for (MessageEntity messageEntity : messages) {
            if ((messageEntity.getSender().getId().equals(userId) && messageEntity.getReceiver().getId().equals(contactId)) ||
                    (messageEntity.getSender().getId().equals(contactId) && messageEntity.getReceiver().getId().equals(userId))) {
                list.add(messageMapper.toResponse(messageEntity));
            }
        }
        return list;
    }
}
