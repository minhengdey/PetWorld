package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.PetRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.PetResponse;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.service.PetService;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasRole('PET_OWNER') or hasRole('PET_CENTER') or hasRole('PET')")
@RestController
@RequestMapping(value = "/pet")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetController {
    PetService petService;

    @PreAuthorize("hasRole('PET_OWNER') or hasRole('PET_CENTER')")
    @PostMapping()
    public ApiResponse<PetResponse> create (@RequestBody @Valid PetRequest request) {
        String role = String.valueOf(SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities());
        System.out.println(role);
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        if (role.equals("[ROLE_PET_OWNER]")) {
            return ApiResponse.<PetResponse>builder()
                    .result(petService.createForPetOwner(request, userId))
                    .build();
        } else if (role.equals("[ROLE_PET_CENTER]")) {
            return ApiResponse.<PetResponse>builder()
                    .result(petService.createForPetCenter(request, userId))
                    .build();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @GetMapping(value = "/{id}")
    @PostAuthorize("hasRole('PET_OWNER') or hasRole('PET_CENTER') or (#id.toString() == authentication.token.claims['sub'] and hasRole('PET'))")
    public ApiResponse<PetResponse> getPet (@PathVariable("id") Long id) {
        String role = String.valueOf(SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities());
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        PetResponse response = petService.getPet(id);
        if ((role.equals("[ROLE_PET]")) || (response.getPetOwner() != null &&
                response.getPetOwner().getId().equals(userId) && role.equals("[ROLE_PET_OWNER]")) ||
                (response.getPetCenter() != null && response.getPetCenter().getId().equals(userId) &&
                        role.equals("[ROLE_PET_CENTER]"))) {
            return ApiResponse.<PetResponse>builder()
                    .result(response)
                    .build();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @PutMapping(value = "/{id}")
    @PostAuthorize("hasRole('PET_OWNER') or hasRole('PET_CENTER') or (#id.toString() == authentication.token.claims['sub'] and hasRole('PET'))")
    public ApiResponse<PetResponse> updatePetByIdAndUserId (@RequestBody @Valid PetRequest request, @PathVariable("id") Long id) {
        String role = String.valueOf(SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities());
        System.out.println(role);
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return switch (role) {
            case "[ROLE_PET_OWNER]" -> ApiResponse.<PetResponse>builder()
                    .result(petService.updatePetForPetOwner(request, id, userId))
                    .build();
            case "[ROLE_PET_CENTER]" -> ApiResponse.<PetResponse>builder()
                    .result(petService.updatePetForPetCenter(request, id, userId))
                    .build();
            case "[ROLE_PET]" -> ApiResponse.<PetResponse>builder()
                    .result(petService.updatePetForPet(request, id))
                    .build();
            default -> throw new AppException(ErrorCode.UNAUTHENTICATED);
        };
    }

    @PreAuthorize("hasRole('PET_OWNER') or hasRole('PET_CENTER')")
    @DeleteMapping(value = "/{id}")
    public void deletePet (@PathVariable("id") Long id) {
        String role = String.valueOf(SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities());
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        PetResponse response = petService.getPet(id);
        if ((response.getPetOwner() != null && response.getPetOwner().getId().equals(userId) && role.equals("[ROLE_PET_OWNER]")) ||
                (response.getPetCenter() != null && response.getPetCenter().getId().equals(userId) && role.equals("[ROLE_PET_CENTER]"))) {
            petService.deletePet(id);
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
