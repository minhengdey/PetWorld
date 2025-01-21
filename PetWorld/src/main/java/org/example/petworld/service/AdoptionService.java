package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.AdoptionRequest;
import org.example.petworld.dto.response.AdoptionResponse;
import org.example.petworld.entity.AdoptionEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.AdoptionMapper;
import org.example.petworld.repository.AdoptionRepository;
import org.example.petworld.repository.PetOwnerRepository;
import org.example.petworld.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdoptionService {
    AdoptionRepository adoptionRepository;
    AdoptionMapper adoptionMapper;
    PetOwnerRepository petOwnerRepository;
    PetRepository petRepository;

    public AdoptionResponse createAdoption(AdoptionRequest request, Long petOwnerId, Long petId) {
        PetOwnerEntity petOwner = petOwnerRepository.findByIdAndIsDeleted(petOwnerId, false).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        PetEntity pet = petRepository.findByIdAndIsDeleted(petId, false).orElseThrow(() ->
                new AppException(ErrorCode.PET_NOT_FOUND));
        AdoptionEntity adoption = adoptionMapper.toEntity(request);
        adoption.setPet(pet);
        adoption.setPetOwner(petOwner);
        adoption.setCreatedAt(new Date());
        adoption.setDeleted(false);
        pet.getAdoptions().add(adoption);
        petOwner.getAdoptions().add(adoption);
        return adoptionMapper.toResponse(adoptionRepository.save(adoption));
    }

    public AdoptionResponse getAdoption(Long id) {
        return adoptionMapper.toResponse(adoptionRepository.findByIdAndIsDeleted(id, false).orElseThrow(() ->
                new AppException(ErrorCode.ADOPTION_NOT_FOUND)));
    }

    public AdoptionResponse updateAdoption(AdoptionRequest request, Long id) {
        AdoptionEntity adoption = adoptionRepository.findByIdAndIsDeleted(id, false).orElseThrow(() ->
                new AppException(ErrorCode.ADOPTION_NOT_FOUND));
        adoptionMapper.update(adoption, request);
        adoption.setUpdatedAt(new Date());
        return adoptionMapper.toResponse(adoptionRepository.save(adoption));
    }

    public void deleteAdoption(Long id) {
        AdoptionEntity adoption = adoptionRepository.findByIdAndIsDeleted(id, false).orElseThrow(() ->
                new AppException(ErrorCode.ADOPTION_NOT_FOUND));
        adoption.setDeletedAt(new Date());
        adoption.setDeleted(true);
        adoptionRepository.save(adoption);
    }
}
