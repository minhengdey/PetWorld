package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetRequest;
import org.example.petworld.dto.response.PetResponse;
import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.enums.Role;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.PetMapper;
import org.example.petworld.repository.PetCenterRepository;
import org.example.petworld.repository.PetOwnerRepository;
import org.example.petworld.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetService {
    PetRepository petRepository;
    PetMapper petMapper;
    PetOwnerRepository petOwnerRepository;
    PetCenterRepository petCenterRepository;

    public PetResponse createForPetOwner(PetRequest request, Long petOwnerId) {
        PetOwnerEntity petOwner = petOwnerRepository.findByIdAndIsDeleted(petOwnerId, false)
                .orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_FOUND));
        for (PetEntity pet : petOwner.getPets()) {
            if (pet.getName().equals(request.getName())) {
                throw new AppException(ErrorCode.PET_NAME_EXISTED);
            }
        }
        PetEntity pet = petMapper.toPetEntity(request);
        pet.setPetOwner(petOwner);
        pet.setCreatedAt(new Date());
        pet.setDeleted(false);
        pet.setRole(Role.PET.name());
        petOwner.getPets().add(pet);
        return petMapper.toPetResponse(petRepository.save(pet));
    }

    public PetResponse createForPetCenter(PetRequest request, Long petCenterId) {
        PetCenterEntity petCenter = petCenterRepository.findByIdAndIsDeleted(petCenterId, false)
                .orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_FOUND));
        for (PetEntity pet : petCenter.getPetsAvailable()) {
            if (pet.getName().equals(request.getName())) {
                throw new AppException(ErrorCode.PET_NAME_EXISTED);
            }
        }
        PetEntity pet = petMapper.toPetEntity(request);
        pet.setPetCenter(petCenter);
        pet.setCreatedAt(new Date());
        pet.setDeleted(false);
        petCenter.getPetsAvailable().add(pet);
        return petMapper.toPetResponse(petRepository.save(pet));
    }

    public PetResponse getPet(Long id) {
        return petMapper.toPetResponse(petRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() ->
                        new AppException(ErrorCode.PET_NOT_FOUND)));
    }

    public PetResponse updatePetForPetOwner(PetRequest request, Long id, Long petOwnerId) {
        PetOwnerEntity petOwner = petOwnerRepository
                .findByIdAndIsDeleted(petOwnerId, false)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        PetEntity pet = petRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        if (petRepository.existsByNameAndPetOwnerAndIsDeleted(request.getName(), petOwner, false)) {
            throw new AppException(ErrorCode.PET_NAME_EXISTED);
        }
        petMapper.update(pet, request);
        pet.setUpdatedAt(new Date());
        pet.setPetOwner(petOwner);
        return petMapper.toPetResponse(petRepository.save(pet));
    }

    public PetResponse updatePetForPetCenter(PetRequest request, Long id, Long petCenterId) {
        PetCenterEntity petCenter = petCenterRepository
                .findByIdAndIsDeleted(petCenterId, false)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        PetEntity pet = petRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        if (petRepository.existsByNameAndPetCenterAndIsDeleted(request.getName(), petCenter, false)) {
            throw new AppException(ErrorCode.PET_NAME_EXISTED);
        }
        petMapper.update(pet, request);
        pet.setUpdatedAt(new Date());
        pet.setPetCenter(petCenter);
        return petMapper.toPetResponse(petRepository.save(pet));
    }

    public PetResponse updatePetForPet(PetRequest request, Long id) {
        PetEntity pet = petRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        if (pet.getPetCenter() != null) {
            return updatePetForPetCenter(request, id, pet.getPetCenter().getId());
        } else if (pet.getPetOwner() != null) {
            return updatePetForPetOwner(request, id, pet.getPetOwner().getId());
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    public void deletePet(Long id) {
        PetEntity pet = petRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        pet.setDeleted(true);
        pet.setDeletedAt(new Date());
        petRepository.save(pet);
    }
}
