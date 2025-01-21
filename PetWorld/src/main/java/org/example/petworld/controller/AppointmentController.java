package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.AppointmentRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.AppointmentResponse;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.service.AppointmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/appointment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('PET') or hasRole('PET_CARE_SERVICES')")
public class AppointmentController {
    AppointmentService appointmentService;

    @PostMapping(value = "/{serviceId}")
    @PreAuthorize("hasRole('PET')")
    public ApiResponse<AppointmentResponse> createAppointment (@RequestBody @Valid AppointmentRequest request, @PathVariable("serviceId") Long serviceId) {
        Long petId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<AppointmentResponse>builder()
                .result(appointmentService.createAppointment(request, petId, serviceId))
                .build();
    }

    @GetMapping(value = "/{id}")
    public ApiResponse<AppointmentResponse> getAppointment (@PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        AppointmentResponse response = appointmentService.getAppointment(id);
        if ((response.getPet() != null && userId.equals(response.getPet().getId())) ||
                (response.getService() != null && userId.equals(response.getService().getId()))) {
            return ApiResponse.<AppointmentResponse>builder()
                    .result(response)
                    .build();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @PutMapping(value = "/{id}")
    public ApiResponse<AppointmentResponse> updateAppointment (@RequestBody @Valid AppointmentRequest request, @PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        AppointmentResponse response = appointmentService.getAppointment(id);
        if ((response.getPet() != null && userId.equals(response.getPet().getId())) ||
                (response.getService() != null && userId.equals(response.getService().getId()))) {
            return ApiResponse.<AppointmentResponse>builder()
                    .result(appointmentService.updateAppointment(request, id))
                    .build();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    public void deleteAppointment (@PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        AppointmentResponse response = appointmentService.getAppointment(id);
        if (response.getService() != null && userId.equals(response.getService().getId())) {
            appointmentService.deleteAppointment(id);
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
