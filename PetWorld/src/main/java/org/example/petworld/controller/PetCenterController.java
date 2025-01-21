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

@PreAuthorize("hasRole('PET_CENTER')")
@RestController
@RequestMapping(value = "/pet-center")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetCenterController {
    PetCenterService petCenterService;

    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @PutMapping(value = "/{id}")
    public ApiResponse<PetCenterResponse> update (@RequestBody @Valid PetCenterRequest request, @PathVariable Long id) {
        return ApiResponse.<PetCenterResponse>builder()
                .result(petCenterService.update(request, id))
                .build();
    }

    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @GetMapping(value = "/{id}")
    public ApiResponse<PetCenterResponse> findUserById (@PathVariable Long id) {
        return ApiResponse.<PetCenterResponse>builder()
                .result(petCenterService.getById(id))
                .build();
    }

    @PostAuthorize("#id.toString() == authentication.token.claims['sub']")
    @DeleteMapping(value = "/{id}")
    public void deleteById (@PathVariable Long id) {
        petCenterService.deleteById(id);
    }
}
