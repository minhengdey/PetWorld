package org.example.petworld.repository;

import org.example.petworld.entity.PetCenterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetCenterRepository extends JpaRepository<PetCenterEntity, Long> {
    boolean existsByEmailAndIsDeleted(String email, boolean isDeleted);
    Optional<PetCenterEntity> findByEmailAndIsDeleted(String email, boolean isDeleted);
    boolean existsByIdAndIsDeleted(Long id, boolean isDeleted);
    Optional<PetCenterEntity> findByIdAndIsDeleted(Long id, boolean isDeleted);
}
