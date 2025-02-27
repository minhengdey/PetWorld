package org.example.petworld.repository;

import org.example.petworld.entity.PetCareServicesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PetCareServicesRepository extends JpaRepository<PetCareServicesEntity, Long> {
    boolean existsByEmailAndIsDeleted(String email, Boolean isDeleted);
    Optional<PetCareServicesEntity> findByEmailAndIsDeleted(String email, Boolean isDeleted);
    boolean existsByIdAndIsDeleted(Long id, Boolean isDeleted);
    Optional<PetCareServicesEntity> findByIdAndIsDeleted(Long id, Boolean isDeleted);
    List<PetCareServicesEntity> findAllByIsDeleted (Boolean isDeleted);
}
