package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.AdoptionRequest;
import org.example.petworld.dto.request.NotificationRequest;
import org.example.petworld.dto.response.AdoptionResponse;
import org.example.petworld.entity.AdoptionEntity;
import org.example.petworld.entity.NotificationEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.AdoptionMapper;
import org.example.petworld.repository.AdoptionRepository;
import org.example.petworld.repository.PetOwnerRepository;
import org.example.petworld.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdoptionService {
    AdoptionRepository adoptionRepository;
    AdoptionMapper adoptionMapper;
    PetOwnerRepository petOwnerRepository;
    PetRepository petRepository;
    NotificationService notificationService;

    public AdoptionResponse createAdoption(AdoptionRequest request, Long petOwnerId, Long petId) {
        PetOwnerEntity petOwner = petOwnerRepository.findByIdAndIsDeleted(petOwnerId, false).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        PetEntity pet = petRepository.findByIdAndIsDeleted(petId, false).orElseThrow(() ->
                new AppException(ErrorCode.PET_NOT_FOUND));
        AdoptionEntity adoption = adoptionMapper.toEntity(request);
        adoption.setPet(pet);
        adoption.setPetOwner(petOwner);
        adoption.setCreatedAt(new Date());
        adoption.setIsDeleted(false);
        adoption.setStatus("Pending");
        pet.setAdoption(adoption);
        petOwner.getAdoptions().add(adoption);
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .user(pet.getPetCenter())
                .message(petOwner.getName() + " has requested to adopt " + pet.getName() + ".")
                .path("http://localhost:8080/adoption-requests")
                .build();
        notificationService.sendNotification(notificationRequest);
        return adoptionMapper.toResponse(adoptionRepository.save(adoption));
    }

    public AdoptionResponse getAdoption(Long id) {
        return adoptionMapper.toResponse(adoptionRepository.findByIdAndIsDeleted(id, false).orElseThrow(() ->
                new AppException(ErrorCode.ADOPTION_NOT_FOUND)));
    }

    public List<AdoptionResponse> getAllAdoptionRequests(Long userId) {
        List<AdoptionEntity> list = adoptionRepository.findAll();
        List<AdoptionResponse> adoptionResponses = new ArrayList<>();
        for (AdoptionEntity adoption : list) {
            if (adoption.getPetOwner().getId().equals(userId) || adoption.getPet().getPetCenter().getId().equals(userId)) {
                adoptionResponses.add(adoptionMapper.toResponse(adoption));
            }
        }
        adoptionResponses.sort(Comparator
                .comparing(AdoptionResponse::getNextMeetingDate,
                        Comparator.nullsLast(Comparator.naturalOrder())));
        return adoptionResponses;
    }

    public List<AdoptionResponse> getAllAdoption() {
        return adoptionRepository.findAll().stream()
                .map(adoptionMapper::toResponse).toList();
    }

    public AdoptionResponse updateAdoption(AdoptionRequest request, Long id) {
        AdoptionEntity adoption = adoptionRepository.findByIdAndIsDeleted(id, false).orElseThrow(() ->
                new AppException(ErrorCode.ADOPTION_NOT_FOUND));
        adoptionMapper.update(adoption, request);
        adoption.setUpdatedAt(new Date());
        if (adoption.getStatus().equals("Accepted")) {
            adoption.getPet().setIsAdopted(true);
            adoption.setAdoptionDate(new Date());
        }
        if (adoption.getStatus().equals("Accepted") || adoption.getStatus().equals("Rejected")) {
            NotificationRequest notificationRequest = NotificationRequest.builder()
                    .user(adoption.getPetOwner())
                    .message("Your request to adopt " + adoption.getPet().getName() + " has been " + adoption.getStatus().toLowerCase() + ".")
                    .path("http://localhost:8080/adopt-pets")
                    .build();
            notificationService.sendNotification(notificationRequest);
        }
        return adoptionMapper.toResponse(adoptionRepository.save(adoption));
    }

    public void deleteAdoption(Long id) {
        AdoptionEntity adoption = adoptionRepository.findByIdAndIsDeleted(id, false).orElseThrow(() ->
                new AppException(ErrorCode.ADOPTION_NOT_FOUND));
        adoption.setDeletedAt(new Date());
        adoption.setIsDeleted(true);
        adoptionRepository.save(adoption);
    }
}
