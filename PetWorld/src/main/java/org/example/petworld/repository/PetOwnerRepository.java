package org.example.petworld.repository;

import org.example.petworld.entity.PetOwnerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetOwnerRepository extends JpaRepository<PetOwnerEntity, Long> {
    boolean existsByEmailAndIsDeleted(String email, boolean isDeleted);
    Optional<PetOwnerEntity> findByEmailAndIsDeleted(String email, boolean isDeleted);
    boolean existsByIdAndIsDeleted(Long id, boolean isDeleted);
    Optional<PetOwnerEntity> findByIdAndIsDeleted(Long id, boolean isDeleted);
}
