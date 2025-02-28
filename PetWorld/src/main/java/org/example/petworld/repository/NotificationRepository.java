package org.example.petworld.repository;

import org.example.petworld.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findAllByUserIdAndIsDeleted (Long userId, Boolean isDeleted);
    Optional<NotificationEntity> findByIdAndIsDeleted (Long id, Boolean isDeleted);
    List<NotificationEntity> findAllByUserIdAndIsDeletedAndIsRead (Long userId, Boolean isDeleted, Boolean isRead);
}
