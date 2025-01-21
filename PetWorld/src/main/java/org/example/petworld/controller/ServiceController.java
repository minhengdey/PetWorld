package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.ServiceRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.ServiceResponse;
import org.example.petworld.service.ServiceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/service")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('PET_CARE_SERVICES')")
public class ServiceController {
    ServiceService serviceService;

    @PostMapping()
    public ApiResponse<ServiceResponse> create(@RequestBody @Valid ServiceRequest request) {
        Long petCareServicesId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<ServiceResponse>builder()
                .result(serviceService.createService(request, petCareServicesId))
                .build();
    }

    @GetMapping(value = "/{id}")
    public ApiResponse<ServiceResponse> get(@PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<ServiceResponse>builder()
                .result(serviceService.getService(id, userId))
                .build();
    }

    @PutMapping(value = "/{id}")
    public ApiResponse<ServiceResponse> update(@RequestBody @Valid ServiceRequest request, @PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<ServiceResponse>builder()
                .result(serviceService.updateService(request, userId, id))
                .build();
    }

    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        serviceService.deleteService(id, userId);
    }
}
