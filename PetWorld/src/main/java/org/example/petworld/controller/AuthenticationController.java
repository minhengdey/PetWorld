package org.example.petworld.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.*;
import org.example.petworld.dto.response.*;
import org.example.petworld.service.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping(value = "/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping(value = "/register")
    public ApiResponse<UserResponse> register (@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(authenticationService.register(request))
                .build();
    }

    @PostMapping(value = "/log-in")
    public ApiResponse<AuthenticationResponse> authenticate (@RequestBody @Valid AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authenticate(request))
                .build();
    }

    @PreAuthorize("hasRole('PET_OWNER') or hasRole('PET')")
    @PostMapping(value = "/swap/{id}")
    public ApiResponse<AuthenticationResponse> swapPet (@PathVariable("id") Long id) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.swapPet(id))
                .build();
    }

    @PostMapping(value = "/addNewProfile/{role}")
    public ApiResponse<AuthenticationResponse> addNewProfile (@PathVariable("role") String role) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.addNewProfile(role))
                .build();
    }

    @GetMapping(value = "/myInfo")
    public ApiResponse<Object> getMyInfo () {
        return ApiResponse.builder()
                .result(authenticationService.getMyInfo())
                .build();
    }

    @PostMapping (value = "/log-out")
    public void logout (@RequestBody @Valid LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
    }

    @PostMapping (value = "/refresh")
    public ApiResponse<RefreshResponse> refresh (@RequestBody @Valid RefreshRequest request) throws ParseException, JOSEException {
        return ApiResponse.<RefreshResponse>builder()
                .result(authenticationService.refresh(request))
                .build();
    }
}
