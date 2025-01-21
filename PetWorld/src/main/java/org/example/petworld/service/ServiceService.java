package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.ServiceRequest;
import org.example.petworld.dto.response.ServiceResponse;
import org.example.petworld.entity.PetCareServicesEntity;
import org.example.petworld.entity.ServiceEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.ServiceMapper;
import org.example.petworld.repository.PetCareServicesRepository;
import org.example.petworld.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceService {
    ServiceRepository serviceRepository;
    ServiceMapper serviceMapper;
    PetCareServicesRepository petCareServicesRepository;

    public ServiceResponse createService(ServiceRequest request, Long petCareServicesId) {
        PetCareServicesEntity petCareServices = petCareServicesRepository
                .findByIdAndIsDeleted(petCareServicesId, false).orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_FOUND));
        if (serviceRepository.existsByNameAndIsDeleted(request.getName(), false)) {
            throw new AppException(ErrorCode.SERVICE_EXISTED);
        }
        ServiceEntity service = serviceMapper.toEntity(request);
        service.setCreatedAt(new Date());
        service.setDeleted(false);
        service.setPetCareServices(petCareServices);
        petCareServices.getServices().add(service);
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    public ServiceResponse getService(Long id, Long petCareServicesId) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        if (!service.getPetCareServices().getId().equals(petCareServicesId)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return serviceMapper.toResponse(service);
    }

    public ServiceResponse updateService(ServiceRequest request, Long id, Long petCareServicesId) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        if (!service.getPetCareServices().getId().equals(petCareServicesId)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        serviceMapper.update(service, request);
        service.setUpdatedAt(new Date());
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    public void deleteService(Long id, Long petCareServicesId) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        if (!service.getPetCareServices().getId().equals(petCareServicesId)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        service.setDeleted(true);
        service.setDeletedAt(new Date());
        serviceRepository.save(service);
    }
}
