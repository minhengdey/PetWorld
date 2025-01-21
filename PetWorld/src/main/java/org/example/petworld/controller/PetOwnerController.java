package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetOwnerRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.PetOwnerResponse;
import org.example.petworld.service.PetOwnerService;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasRole('PET_OWNER')")
@RestController
@RequestMapping(value = "/pet-owner")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetOwnerController {
    PetOwnerService petOwnerService;

    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @PutMapping(value = "/{id}")
    public ApiResponse<PetOwnerResponse> update (@RequestBody @Valid PetOwnerRequest request, @PathVariable Long id) {
        return ApiResponse.<PetOwnerResponse>builder()
                .result(petOwnerService.update(request, id))
                .build();
    }

    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @GetMapping(value = "/{id}")
    public ApiResponse<PetOwnerResponse> findUserById (@PathVariable Long id) {
        return ApiResponse.<PetOwnerResponse>builder()
                .result(petOwnerService.getById(id))
                .build();
    }

    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @DeleteMapping(value = "/{id}")
    public void deleteById (@PathVariable Long id) {
        petOwnerService.deleteById(id);
    }
}
