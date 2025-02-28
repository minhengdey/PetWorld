package org.example.petworld.repository;

import org.example.petworld.entity.BaseUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BaseUserRepository extends JpaRepository<BaseUserEntity, Long> {
    Optional<BaseUserEntity> findByIdAndAndIsDeleted (Long id, Boolean isDeleted);
}
