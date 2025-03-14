package org.example.petworld.controller;

import com.cloudinary.Api;
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

import java.util.List;
import java.util.Set;

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
    public ApiResponse<Set<ServiceResponse>> getAllMyServices () {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<Set<ServiceResponse>>builder()
                .result(serviceService.getAllMyServices(userId))
                .code(1000)
                .build();
    }

    @GetMapping(value = "/all")
    public ApiResponse<List<ServiceResponse>> getAllServicesAvailable () {
        return ApiResponse.<List<ServiceResponse>>builder()
                .result(serviceService.getAllServiceAvailable())
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
