package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.ServiceRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.ServiceResponse;
import org.example.petworld.service.ServiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/service")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceController {
    ServiceService serviceService;

    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    @PostMapping()
    public ApiResponse<ServiceResponse> create(@RequestBody @Valid ServiceRequest request) {
        Long petCareServicesId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<ServiceResponse>builder()
                .code(1000)
                .result(serviceService.createService(request, petCareServicesId))
                .build();
    }

    @GetMapping(value = "/{id}")
    public ApiResponse<ServiceResponse> get(@PathVariable("id") Long id) {
        return ApiResponse.<ServiceResponse>builder()
                .code(1000)
                .result(serviceService.getService(id))
                .build();
    }

    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    @GetMapping(value = "/my-services")
    public ApiResponse<Page<ServiceResponse>> getAllMyServices (@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ServiceResponse>>builder()
                .result(serviceService.getAllMyServices(userId, pageable))
                .code(1000)
                .build();
    }

    @GetMapping(value = "/all")
    public ApiResponse<Page<ServiceResponse>> getAllServicesAvailable (@RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ServiceResponse>>builder()
                .result(serviceService.getAllServiceAvailable(pageable))
                .code(1000)
                .build();
    }

    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    @PutMapping(value = "/{id}")
    public ApiResponse<ServiceResponse> update(@RequestBody @Valid ServiceRequest request, @PathVariable("id") Long id) {
        return ApiResponse.<ServiceResponse>builder()
                .code(1000)
                .result(serviceService.updateService(request, id))
                .build();
    }

    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) {
        serviceService.deleteService(id);
    }
}
