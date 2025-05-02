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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        Set<ServiceEntity> serviceEntities = petCareServices.getServices();
        for (ServiceEntity service : serviceEntities) {
            if (service.getName().equals(request.getName())) {
                throw new AppException(ErrorCode.SERVICE_EXISTED);
            }
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

    public List<ServiceResponse> getAllService() {
        return serviceRepository.findAll().stream()
                .map(serviceMapper::toResponse)
                .toList();
    }

    public Page<ServiceResponse> getAllServiceAvailable(Pageable pageable) {
        Page<ServiceEntity> servicePage = serviceRepository.findAllByIsDeletedFalse(pageable);

        List<ServiceResponse> serviceResponses = servicePage.getContent().stream()
                .map(serviceMapper::toResponse).toList();
        return new PageImpl<>(serviceResponses, pageable, servicePage.getTotalElements());
    }

    public Page<ServiceResponse> getAllMyServices(Long petCareServicesId, Pageable pageable) {
        Page<ServiceEntity> servicePage = serviceRepository.findAllByPetCareServicesIdAndIsDeletedFalse(pageable, petCareServicesId);

        List<ServiceResponse> serviceResponses = servicePage.getContent().stream().map(serviceMapper::toResponse).toList();

        return new PageImpl<>(serviceResponses, pageable, servicePage.getTotalElements());
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
