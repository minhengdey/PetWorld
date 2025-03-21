package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.NotificationRequest;
import org.example.petworld.dto.response.NotificationResponse;
import org.example.petworld.entity.BaseUserEntity;
import org.example.petworld.entity.NotificationEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.NotificationMapper;
import org.example.petworld.repository.BaseUserRepository;
import org.example.petworld.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepository notificationRepository;

    NotificationMapper notificationMapper;

    SimpMessagingTemplate messagingTemplate;

    public NotificationResponse sendNotification(NotificationRequest request) {
        NotificationEntity notification = notificationMapper.toEntity(request);
        notification.setIsRead(false);
        notification.setIsDeleted(false);
        notification.setCreatedAt(new Date());
        messagingTemplate.convertAndSendToUser(request.getUser().getId().toString(), "/topic/notifications",
                notificationMapper.toResponse(notificationRepository.save(notification)));
        return notificationMapper.toResponse(notification);
    }

    public List<NotificationResponse> getUserNotifications(Long userId) {
        List<NotificationResponse> list = notificationRepository.findAllByUserIdAndIsDeleted(userId, false)
                .stream().map(notificationMapper::toResponse)
                .collect(Collectors.toList());
        Collections.reverse(list);
        return list;
    }

    public NotificationResponse markAsRead(Long id) {
        NotificationEntity notification = notificationRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setIsRead(true);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    public void markAllAsRead(Long userId) {
        List<NotificationEntity> list = notificationRepository.findAllByUserIdAndIsDeletedAndIsRead(userId, false, false);
        for (NotificationEntity notification : list) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
}
