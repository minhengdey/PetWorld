package org.example.petworld.repository;

import org.example.petworld.entity.AdoptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdoptionRepository extends JpaRepository<AdoptionEntity, Long> {
    Optional<AdoptionEntity> findByIdAndIsDeleted (Long id, boolean isDeleted);
}
