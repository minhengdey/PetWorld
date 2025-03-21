package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetOwnerRequest;
import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.PetOwnerResponse;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.enums.Role;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.PetOwnerMapper;
import org.example.petworld.repository.PetOwnerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetOwnerService {
    PetOwnerRepository petOwnerRepository;
    PetOwnerMapper petOwnerMapper;
    PasswordEncoder passwordEncoder;

    public PetOwnerResponse update(Object request, Long id) {
        if (request instanceof PetOwnerRequest) {
            PetOwnerEntity petOwner = petOwnerRepository.findByIdAndIsDeleted(id, false)
                    .orElseThrow(() ->
                            new AppException(ErrorCode.USER_NOT_FOUND));
            ((PetOwnerRequest) request).setPassword(passwordEncoder
                    .encode(((PetOwnerRequest) request).getPassword()));
            petOwnerMapper.update(petOwner, (PetOwnerRequest) request);
            petOwner.setUpdatedAt(new Date());
            return petOwnerMapper.toPetOwnerResponse(petOwnerRepository.save(petOwner));
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public PetOwnerResponse getById(Long id) {
        return petOwnerMapper.toPetOwnerResponse(petOwnerRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    public void deleteById(Long id) {
        PetOwnerEntity petOwner = petOwnerRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        petOwner.setIsDeleted(true);
        petOwner.setDeletedAt(new Date());
        petOwnerRepository.save(petOwner);
    }

    public UserResponse createProfile(Object request) {
        if (request instanceof UserCreationRequest) {
            if (petOwnerRepository.existsByEmailAndIsDeleted(((UserCreationRequest) request).getEmail(), false)) {
                throw new AppException(ErrorCode.USER_EXISTED);
            }
            PetOwnerEntity petOwner = petOwnerMapper.toPetOwnerEntity((UserCreationRequest) request);
            petOwner.setPassword(passwordEncoder.encode(petOwner.getPassword()));
            petOwner.setRole(Role.PET_OWNER.name());
            petOwner.setCreatedAt(new Date());
            petOwner.setIsDeleted(false);
            return petOwnerMapper.toUserResponse(petOwnerRepository.save(petOwner));
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
