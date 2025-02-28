package org.example.petworld.repository;

import org.example.petworld.entity.BaseUserEntity;
import org.example.petworld.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findAllByIsDeleted (Boolean isDeleted);
}
