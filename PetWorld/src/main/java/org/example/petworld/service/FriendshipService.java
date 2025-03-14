package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.FriendshipRequest;
import org.example.petworld.dto.request.NotificationRequest;
import org.example.petworld.dto.response.FriendshipResponse;
import org.example.petworld.dto.response.PetResponse;
import org.example.petworld.entity.FriendshipEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.FriendshipMapper;
import org.example.petworld.repository.FriendshipRepository;
import org.example.petworld.repository.PetRepository;
import org.springframework.boot.diagnostics.FailureAnalysis;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendshipService {
    FriendshipRepository friendshipRepository;
    FriendshipMapper friendshipMapper;
    PetRepository petRepository;
    NotificationService notificationService;

    public FriendshipResponse createFriendship(Long pet1Id, Long pet2Id) {
        if (pet1Id.equals(pet2Id) || friendshipRepository
                .existsByPet1IdAndPet2IdAndIsDeleted(pet1Id, pet2Id, false)
                || friendshipRepository
                .existsByPet1IdAndPet2IdAndIsDeleted(pet2Id, pet1Id, false)) {
            throw new AppException(ErrorCode.INVALID_FRIEND_REQUEST);
        }
        PetEntity pet1 = petRepository.findByIdAndIsDeleted(pet1Id, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        PetEntity pet2 = petRepository.findByIdAndIsDeleted(pet2Id, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        FriendshipEntity friendship = new FriendshipEntity();
        friendship.setPet1(pet1);
        friendship.setPet2(pet2);
        friendship.setCreatedAt(new Date());
        friendship.setIsDeleted(false);
        friendship.setIsAccepted(false);
        pet1.getFriendRequestSent().add(friendship);
        pet2.getFriendRequest().add(friendship);
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .user(pet2)
                .message(pet1.getName() + " has sent you a friend request.")
                .path("http://localhost:8080/friend-requests")
                .build();
        notificationService.sendNotification(notificationRequest);
        return friendshipMapper.toResponse(friendshipRepository.save(friendship));
    }

    public FriendshipResponse updateFriendship(FriendshipRequest request, Long id) {
        FriendshipEntity friendship = friendshipRepository.findByIdAndAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND));
        friendshipMapper.update(friendship, request);
        assert friendship != null;
        if (!friendship.getIsAccepted()) {
            friendship.setIsDeleted(true);
            friendship.setDeletedAt(new Date());
        } else {
            NotificationRequest notificationRequest = NotificationRequest.builder()
                    .user(friendship.getPet1())
                    .message(friendship.getPet2().getName() + " has accepted your friend request.")
                    .path("http://localhost:8080/friends")
                    .build();
            notificationService.sendNotification(notificationRequest);
        }
        friendship.setUpdatedAt(new Date());
        return friendshipMapper.toResponse(friendshipRepository.save(friendship));
    }

    public FriendshipResponse getFriendship(Long pet1Id, Long pet2Id) {
        if (friendshipRepository.existsByPet1IdAndPet2IdAndIsDeleted(pet1Id, pet2Id, false)) {
            return friendshipMapper.toResponse(friendshipRepository
                    .findByPet1IdAndPet2IdAndIsDeleted(pet1Id, pet2Id, false).orElse(null));
        } else if (friendshipRepository.existsByPet1IdAndPet2IdAndIsDeleted(pet2Id, pet1Id, false)) {
            return friendshipMapper.toResponse(friendshipRepository
                    .findByPet1IdAndPet2IdAndIsDeleted(pet2Id, pet1Id, false).orElse(null));
        } else {
            throw new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND);
        }
    }

    public List<FriendshipResponse> getFriends(Long petId) {
        List<FriendshipEntity> list = friendshipRepository.findAllByIsDeletedAndIsAccepted(false, true);
        List<FriendshipResponse> friendshipResponses = new ArrayList<>();
        for (FriendshipEntity friendship : list) {
            if (friendship.getPet1().getId().equals(petId) || friendship.getPet2().getId().equals(petId)) {
                friendshipResponses.add(friendshipMapper.toResponse(friendship));
            }
        }
        return friendshipResponses;
    }

    public Set<FriendshipResponse> getFriendRequests(Long petId) {
        List<FriendshipEntity> list = friendshipRepository.findAll();
        Set<FriendshipResponse> friendshipResponses = new HashSet<>();
        for (FriendshipEntity friendship : list) {
            if (!friendship.getIsDeleted() && friendship.getPet2().getId().equals(petId) && !friendship.getIsAccepted()) {
                friendshipResponses.add(friendshipMapper.toResponse(friendship));
            }
        }
        return friendshipResponses;
    }

    public List<FriendshipResponse> getAllFriendship() {
        return friendshipRepository.findAll().stream()
                .map(friendshipMapper::toResponse).toList();
    }

    public void deleteFriendship(Long pet1Id, Long pet2Id) {
        if (!friendshipRepository.existsByPet1IdAndPet2IdAndIsDeleted(pet1Id, pet2Id, false) &&
                !friendshipRepository.existsByPet1IdAndPet2IdAndIsDeleted(pet2Id, pet1Id, false)) {
            throw new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND);
        } else if (friendshipRepository.existsByPet1IdAndPet2IdAndIsDeleted(pet1Id, pet2Id, false)) {
            FriendshipEntity friendship = friendshipRepository
                    .findByPet1IdAndPet2IdAndIsDeleted(pet1Id, pet2Id, false)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            friendship.setIsDeleted(true);
            friendship.setDeletedAt(new Date());
            friendshipRepository.save(friendship);
        } else {
            FriendshipEntity friendship = friendshipRepository
                    .findByPet1IdAndPet2IdAndIsDeleted(pet2Id, pet1Id, false)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            friendship.setIsDeleted(true);
            friendship.setDeletedAt(new Date());
            friendshipRepository.save(friendship);
        }
    }
}
