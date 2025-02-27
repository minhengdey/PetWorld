package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetCareServicesRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.PetCareServicesResponse;
import org.example.petworld.service.PetCareServicesService;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/pet-care-services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetCareServicesController {
    PetCareServicesService petCareServicesService;

    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @PutMapping(value = "/{id}")
    public ApiResponse<PetCareServicesResponse> update (@RequestBody @Valid PetCareServicesRequest request, @PathVariable Long id) {
        return ApiResponse.<PetCareServicesResponse>builder()
                .code(1000)
                .result(petCareServicesService.update(request, id))
                .build();
    }

    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @GetMapping(value = "/{id}")
    public ApiResponse<PetCareServicesResponse> findUserById (@PathVariable Long id) {
        return ApiResponse.<PetCareServicesResponse>builder()
                .code(1000)
                .result(petCareServicesService.getById(id))
                .build();
    }

    @PreAuthorize("hasRole('PET_CARE_SERVICES')")
    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @DeleteMapping(value = "/{id}")
    public void deleteById (@PathVariable Long id) {
        petCareServicesService.deleteById(id);
    }

    @GetMapping(value = "/all")
    public ApiResponse<Set<PetCareServicesResponse>> getAll () {
        return ApiResponse.<Set<PetCareServicesResponse>>builder()
                .code(1000)
                .result(petCareServicesService.getAll())
                .build();
    }
}
