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

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/appointment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('PET_OWNER') or hasRole('PET_CARE_SERVICES')")
public class AppointmentController {
    AppointmentService appointmentService;

    @PostMapping(value = "/{serviceId}")
    @PreAuthorize("hasRole('PET_OWNER')")
    public ApiResponse<AppointmentResponse> createAppointment (@RequestBody @Valid AppointmentRequest request,
                                                               @PathVariable("serviceId") Long serviceId) {
        return ApiResponse.<AppointmentResponse>builder()
                .code(1000)
                .result(appointmentService.createAppointment(request, serviceId))
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
                    .code(1000)
                    .result(response)
                    .build();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @GetMapping(value = "/my-appointments")
    public ApiResponse<List<AppointmentResponse>> getAllByUserId () {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        String role = String.valueOf(SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities());
        if (role.equals("[ROLE_PET_OWNER]")) {
            return ApiResponse.<List<AppointmentResponse>>builder()
                    .code(1000)
                    .result(appointmentService.getAllByPetOwnerId(userId))
                    .build();
        } else {
            return ApiResponse.<List<AppointmentResponse>>builder()
                    .code(1000)
                    .result(appointmentService.getAllByPetCareServicesId(userId))
                    .build();
        }
    }

    @PutMapping(value = "/{id}")
    public ApiResponse<AppointmentResponse> updateAppointment (@RequestBody @Valid AppointmentRequest request, @PathVariable("id") Long id) {
        return ApiResponse.<AppointmentResponse>builder()
                    .code(1000)
                    .result(appointmentService.updateAppointment(request, id))
                    .build();
    }

    @DeleteMapping(value = "/{id}")
    public void deleteAppointment (@PathVariable("id") Long id) {
        appointmentService.deleteAppointment(id);
    }
}
