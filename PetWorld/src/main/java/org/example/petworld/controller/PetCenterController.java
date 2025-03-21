package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetCenterRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.PetCenterResponse;
import org.example.petworld.service.PetCenterService;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/pet-center")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetCenterController {
    PetCenterService petCenterService;

    @PreAuthorize("hasRole('PET_CENTER')")
    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @PutMapping(value = "/{id}")
    public ApiResponse<PetCenterResponse> update (@RequestBody @Valid PetCenterRequest request, @PathVariable Long id) {
        return ApiResponse.<PetCenterResponse>builder()
                .code(1000)
                .result(petCenterService.update(request, id))
                .build();
    }

    @GetMapping(value = "/{id}")
    public ApiResponse<PetCenterResponse> findUserById (@PathVariable Long id) {
        return ApiResponse.<PetCenterResponse>builder()
                .code(1000)
                .result(petCenterService.getById(id))
                .build();
    }

    @PreAuthorize("hasRole('PET_CENTER')")
    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @DeleteMapping(value = "/{id}")
    public void deleteById (@PathVariable Long id) {
        petCenterService.deleteById(id);
    }
}
