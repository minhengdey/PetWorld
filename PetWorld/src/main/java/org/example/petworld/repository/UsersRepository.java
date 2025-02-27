package org.example.petworld.repository;

import org.example.petworld.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<UsersEntity, Long> {
    Optional<UsersEntity> findByIdAndIsDeleted (Long id, boolean isDeleted);
    Optional<UsersEntity> findByEmailAndRoleAndIsDeleted (String email, String role, boolean isDeleted);
    boolean existsByEmailAndIsDeleted (String email, boolean isDeleted);
}
