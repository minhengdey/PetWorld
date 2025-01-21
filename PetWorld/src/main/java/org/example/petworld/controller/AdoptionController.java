package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.AdoptionRequest;
import org.example.petworld.dto.response.AdoptionResponse;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.service.AdoptionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/adoption")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('PET_OWNER') or hasRole('PET_CENTER')")
public class AdoptionController {
    AdoptionService adoptionService;

    @PostMapping(value = "/{petId}")
    @PreAuthorize("hasRole('PET_OWNER')")
    public ApiResponse<AdoptionResponse> createAdoption (@RequestBody @Valid AdoptionRequest request, @PathVariable("petId") Long petId) {
        Long petOwnerId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<AdoptionResponse>builder()
                .result(adoptionService.createAdoption(request, petOwnerId, petId))
                .build();
    }

    @GetMapping(value = "/{id}")
    public ApiResponse<AdoptionResponse> getAdoption (@PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        AdoptionResponse response = adoptionService.getAdoption(id);
        if ((response.getPet() != null && userId.equals(response.getPet().getId())) ||
                (response.getPetOwner() != null && userId.equals(response.getPetOwner().getId()))) {
            return ApiResponse.<AdoptionResponse>builder()
                    .result(response)
                    .build();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @PutMapping(value = "/{id}")
    public ApiResponse<AdoptionResponse> updateAdoption (@RequestBody @Valid AdoptionRequest request, @PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        AdoptionResponse response = adoptionService.getAdoption(id);
        if ((response.getPet() != null && userId.equals(response.getPet().getId())) ||
                (response.getPetOwner() != null && userId.equals(response.getPetOwner().getId()))) {
            return ApiResponse.<AdoptionResponse>builder()
                    .result(adoptionService.updateAdoption(request, id))
                    .build();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('PET_CENTER')")
    public void deleteAdoption (@PathVariable("id") Long id) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        AdoptionResponse response = adoptionService.getAdoption(id);
        if (response.getPet() != null && userId.equals(response.getPet().getId())) {
            adoptionService.deleteAdoption(id);
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
