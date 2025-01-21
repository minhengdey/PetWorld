package org.example.petworld.repository;

import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PetRepository extends JpaRepository<PetEntity, Long> {
    Optional<PetEntity> findByIdAndIsDeleted (Long id, boolean isDeleted);
    boolean existsByNameAndPetCenterAndIsDeleted (String name, PetCenterEntity petCenter, boolean isDeleted);
    boolean existsByNameAndPetOwnerAndIsDeleted (String name, PetOwnerEntity petOwner, boolean isDeleted);
}
