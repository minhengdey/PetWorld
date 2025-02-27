package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.FriendshipRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.FriendshipResponse;
import org.example.petworld.service.FriendshipService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@PreAuthorize("hasRole('PET')")
@RestController
@RequestMapping(value = "/friendship")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendshipController {
    FriendshipService friendshipService;

    @PostMapping(value = "/{pet2Id}")
    public ApiResponse<FriendshipResponse> create (@PathVariable("pet2Id") Long pet2Id) {
        Long pet1Id = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<FriendshipResponse>builder()
                .result(friendshipService.createFriendship(pet1Id, pet2Id)).build();
    }

    @GetMapping(value = "/{pet2Id}")
    public ApiResponse<FriendshipResponse> getFriendship (@PathVariable("pet2Id") Long pet2Id) {
        Long pet1Id = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<FriendshipResponse>builder()
                .result(friendshipService.getFriendship(pet1Id, pet2Id))
                .build();
    }

    @GetMapping(value = "/friend-requests")
    public ApiResponse<Set<FriendshipResponse>> getFriendRequests () {
        Long petId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        System.out.println(petId);
        return ApiResponse.<Set<FriendshipResponse>>builder()
                .code(1000)
                .result(friendshipService.getFriendRequests(petId))
                .build();
    }

    @GetMapping(value = "/friends")
    public ApiResponse<Set<FriendshipResponse>> getFriends () {
        Long petId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<Set<FriendshipResponse>>builder()
                .code(1000)
                .result(friendshipService.getFriends(petId))
                .build();
    }

    @PutMapping(value = "/{id}")
    public ApiResponse<FriendshipResponse> updateFriendship (@RequestBody @Valid FriendshipRequest request, @PathVariable("id") Long id) {
        return ApiResponse.<FriendshipResponse>builder()
                .result(friendshipService.updateFriendship(request, id))
                .build();
    }

    @DeleteMapping(value = "/{pet2Id}")
    public void deleteFriendship (@PathVariable("pet2Id") Long pet2Id) {
        Long pet1Id = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        friendshipService.deleteFriendship(pet1Id, pet2Id);
    }
}
