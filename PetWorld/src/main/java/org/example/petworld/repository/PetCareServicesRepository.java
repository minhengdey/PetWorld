package org.example.petworld.repository;

import org.example.petworld.entity.PetCareServicesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetCareServicesRepository extends JpaRepository<PetCareServicesEntity, Long> {
    boolean existsByEmailAndIsDeleted(String email, boolean isDeleted);
    Optional<PetCareServicesEntity> findByEmailAndIsDeleted(String email, boolean isDeleted);
    boolean existsByIdAndIsDeleted(Long id, boolean isDeleted);
    Optional<PetCareServicesEntity> findByIdAndIsDeleted(Long id, boolean isDeleted);
}
