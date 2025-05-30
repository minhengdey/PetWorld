package org.example.petworld.repository;

import org.example.petworld.entity.AppointmentEntity;
import org.example.petworld.entity.PetCareServicesEntity;
import org.example.petworld.entity.ServiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    Optional<ServiceEntity> findByIdAndIsDeleted (Long id, boolean isDeleted);
    boolean existsByNameAndIsDeleted (String name, boolean isDeleted);
    Page<ServiceEntity> findAllByPetCareServicesIdAndIsDeletedFalse (Pageable pageable, Long petCareServicesId);
    Page<ServiceEntity> findAllByIsDeletedFalse (Pageable pageable);
}
