package org.example.petworld.repository;

import org.example.petworld.entity.FriendshipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<FriendshipEntity, Long> {
    boolean existsByPet1IdAndPet2IdAndIsDeleted (Long pet1Id, Long pet2Id, Boolean isDeleted);
    Optional<FriendshipEntity> findByPet1IdAndPet2IdAndIsDeleted (Long pet1Id, Long pet2Id, Boolean isDeleted);
    List<FriendshipEntity> findAllByIsDeletedAndIsAccepted (Boolean isDeleted, Boolean isAccepted);
    Optional<FriendshipEntity> findByIdAndAndIsDeleted (Long id, Boolean isDeleted);
}
