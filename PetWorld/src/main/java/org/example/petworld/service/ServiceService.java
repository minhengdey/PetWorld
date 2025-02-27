package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.ServiceRequest;
import org.example.petworld.dto.response.PetCareServicesResponse;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
        service.setIsDeleted(false);
        service.setUsedCount(0);
        service.setPetCareServices(petCareServices);
        petCareServices.getServices().add(service);
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    public ServiceResponse getService(Long id) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        return serviceMapper.toResponse(service);
    }

    public Set<ServiceResponse> getAll() {
        return serviceRepository.findAllByIsDeleted(false).stream()
                .map(serviceMapper::toResponse)
                .collect(Collectors.toSet());
    }

    public Set<ServiceResponse> getAllMyServices(Long petCareServicesId) {
        List<ServiceEntity> list = serviceRepository.findAllByIsDeleted(false);
        Set<ServiceResponse> serviceResponses = new HashSet<>();
        for (ServiceEntity service : list) {
            if (service.getPetCareServices().getId().equals(petCareServicesId)) {
                serviceResponses.add(serviceMapper.toResponse(service));
            }
        }
        return serviceResponses;
    }

    public ServiceResponse updateService(ServiceRequest request, Long id) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        serviceMapper.update(service, request);
        service.setUpdatedAt(new Date());
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    public void deleteService(Long id) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        service.setIsDeleted(true);
        service.setDeletedAt(new Date());
        serviceRepository.save(service);
    }
}
