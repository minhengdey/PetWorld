package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetCenterRequest;
import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.PetCenterResponse;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.enums.Role;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.PetCenterMapper;
import org.example.petworld.repository.PetCenterRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetCenterService {
    PetCenterRepository petCenterRepository;
    PetCenterMapper petCenterMapper;
    PasswordEncoder passwordEncoder;

    public UserResponse createProfile(Object request) {
        if (request instanceof UserCreationRequest) {
            PetCenterEntity petCenter = petCenterMapper.toPetCenterEntity((UserCreationRequest) request);
            petCenter.setPassword(passwordEncoder.encode(petCenter.getPassword()));
            petCenter.setRole(Role.PET_CENTER.name());
            petCenter.setCreatedAt(new Date());
            petCenter.setIsDeleted(false);
            return petCenterMapper.toUserResponse(petCenterRepository.save(petCenter));
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public PetCenterResponse update(Object request, Long id) {
        if (request instanceof PetCenterRequest) {
            PetCenterEntity petCenter = petCenterRepository.findByIdAndIsDeleted(id, false)
                    .orElseThrow(() ->
                            new AppException(ErrorCode.USER_NOT_FOUND));
            petCenterMapper.update(petCenter, (PetCenterRequest) request);
            petCenter.setUpdatedAt(new Date());
            return petCenterMapper.toPetCenterResponse(petCenterRepository.save(petCenter));
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public PetCenterResponse getById(Long id) {
        return petCenterMapper.toPetCenterResponse(petCenterRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    public void deleteById(Long id) {
        PetCenterEntity petCenter = petCenterRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        petCenter.setIsDeleted(true);
        petCenter.setDeletedAt(new Date());
        petCenterRepository.save(petCenter);
    }
}
