package org.example.petworld.controller;

import com.cloudinary.Api;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.response.*;
import org.example.petworld.service.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    UsersService usersService;
    PetService petService;
    ServiceService serviceService;
    AdoptionService adoptionService;
    AppointmentService appointmentService;
    FriendshipService friendshipService;

    @GetMapping(value = "/users")
    public ApiResponse<List<UserResponse>> getAllUser () {
        return ApiResponse.<List<UserResponse>>builder()
                .result(usersService.getAllUser())
                .code(1000)
                .build();
    }

    @GetMapping(value = "/pets")
    public ApiResponse<List<PetResponse>> getAllPet () {
        return ApiResponse.<List<PetResponse>>builder()
                .result(petService.getAllPet())
                .code(1000)
                .build();
    }

    @GetMapping(value = "/services")
    public ApiResponse<List<ServiceResponse>> getAllService () {
        return ApiResponse.<List<ServiceResponse>>builder()
                .result(serviceService.getAllService())
                .code(1000)
                .build();
    }

    @GetMapping(value = "/adoptions")
    public ApiResponse<List<AdoptionResponse>> getAllAdoption () {
        return ApiResponse.<List<AdoptionResponse>>builder()
                .result(adoptionService.getAllAdoption())
                .code(1000)
                .build();
    }

    @GetMapping(value = "/appointments")
    public ApiResponse<List<AppointmentResponse>> getAllAppointment () {
        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointmentService.getAllAppointment())
                .code(1000)
                .build();
    }

    @GetMapping(value = "/friendships")
    public ApiResponse<List<FriendshipResponse>> getAllFriendship () {
        return ApiResponse.<List<FriendshipResponse>>builder()
                .result(friendshipService.getAllFriendship())
                .code(1000)
                .build();
    }
}
