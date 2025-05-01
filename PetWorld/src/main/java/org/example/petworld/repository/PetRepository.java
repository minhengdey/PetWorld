package org.example.petworld.repository;

import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PetRepository extends JpaRepository<PetEntity, Long> {
    Optional<PetEntity> findByIdAndIsDeleted (Long id, boolean isDeleted);
    Optional<PetEntity> findByNameAndPetOwnerIdAndIsDeleted (String name, Long petOwnerId, boolean isDeleted);
    List<PetEntity> findAllByIsDeleted (Boolean isDeleted);
    boolean existsByNameAndPetCenterAndIsDeleted (String name, PetCenterEntity petCenter, boolean isDeleted);
    boolean existsByNameAndPetOwnerAndIsDeleted (String name, PetOwnerEntity petOwner, boolean isDeleted);
    Page<PetEntity> findAllByIsDeletedFalseAndPetOwnerId(Pageable pageable, Long petOwnerId);
    Page<PetEntity> findAllByIsDeletedFalseAndPetCenterId(Pageable pageable, Long petCenterId);
}
