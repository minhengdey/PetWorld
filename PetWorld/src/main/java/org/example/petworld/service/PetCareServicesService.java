package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetCareServicesRequest;
import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.PetCareServicesResponse;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.PetCareServicesEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.enums.Role;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.PetCareServicesMapper;
import org.example.petworld.repository.PetCareServicesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetCareServicesService {
    PetCareServicesRepository petCareServicesRepository;
    PetCareServicesMapper petCareServicesMapper;
    PasswordEncoder passwordEncoder;

    public UserResponse createProfile(Object request) {
        if (request instanceof UserCreationRequest) {
            PetCareServicesEntity service = petCareServicesMapper
                    .toServiceEntity((UserCreationRequest) request);
            service.setPassword(passwordEncoder.encode(service.getPassword()));
            service.setCreatedAt(new Date());
            service.setIsDeleted(false);
            return petCareServicesMapper.toUserResponse(petCareServicesRepository.save(service));
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public PetCareServicesResponse update(Object request, Long id) {
        if (request instanceof PetCareServicesRequest) {
            PetCareServicesEntity petCareServices = petCareServicesRepository
                    .findByIdAndIsDeleted(id, false)
                    .orElseThrow(() ->
                            new AppException(ErrorCode.USER_NOT_FOUND));
            petCareServicesMapper.update(petCareServices, (PetCareServicesRequest) request);
            petCareServices.setUpdatedAt(new Date());
            return petCareServicesMapper.toPetCareServicesResponse(petCareServicesRepository.save(petCareServices));
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public PetCareServicesResponse getById(Long id) {
        return petCareServicesMapper.toPetCareServicesResponse(petCareServicesRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    public Page<PetCareServicesResponse> getAll(Pageable pageable) {
        Page<PetCareServicesEntity> petCareServicesPage = petCareServicesRepository.findAllByIsDeletedFalse(pageable);
        List<PetCareServicesResponse> petCareServicesResponses = petCareServicesPage.getContent()
                .stream().map(petCareServicesMapper::toPetCareServicesResponse).toList();
        return new PageImpl<>(petCareServicesResponses, pageable, petCareServicesPage.getTotalElements());
    }

    public void deleteById(Long id) {
        PetCareServicesEntity petCareServices = petCareServicesRepository
                .findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        petCareServices.setIsDeleted(true);
        petCareServices.setDeletedAt(new Date());
        petCareServicesRepository.save(petCareServices);
    }
}
