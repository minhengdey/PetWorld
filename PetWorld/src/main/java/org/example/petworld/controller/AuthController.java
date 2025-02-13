package org.example.petworld.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.AuthenticationRequest;
import org.example.petworld.dto.request.LogoutRequest;
import org.example.petworld.dto.request.RefreshRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.AuthenticationResponse;
import org.example.petworld.dto.response.RefreshResponse;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.service.AuthenticationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Arrays;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthenticationService authenticationService;

    @PostMapping(value = "/log-in")
    public ApiResponse<AuthenticationResponse> authenticate (@RequestBody @Valid AuthenticationRequest request, HttpServletResponse response) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
        Cookie cookie = new Cookie("jwt", authenticationResponse.getToken());
        cookie.setHttpOnly(true);  // Ensure the cookie is HttpOnly to prevent XSS attacks
        cookie.setSecure(false);  // Make sure cookie is sent only over HTTPS
        cookie.setPath("/");  // Cookie is available to all paths
        cookie.setMaxAge(60 * 60 * 24);  // Expiration time, e.g., 1 day
        response.addCookie(cookie);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationResponse)
                .code(1000)
                .build();
    }

    @PreAuthorize("hasRole('PET_OWNER') or hasRole('PET')")
    @PostMapping(value = "/swap/{id}")
    public ApiResponse<AuthenticationResponse> swapPet (@PathVariable("id") Long id, HttpServletResponse response) {
        AuthenticationResponse authenticationResponse = authenticationService.swapPet(id);
        Cookie cookie = new Cookie("jwt", authenticationResponse.getToken());
        cookie.setHttpOnly(true);  // Ensure the cookie is HttpOnly to prevent XSS attacks
        cookie.setSecure(false);  // Make sure cookie is sent only over HTTPS
        cookie.setPath("/");  // Cookie is available to all paths
        cookie.setMaxAge(60 * 60 * 24);  // Expiration time, e.g., 1 day
        response.addCookie(cookie);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationResponse)
                .code(1000)
                .build();
    }

    @PostMapping(value = "/addNewProfile/{role}")
    public ApiResponse<AuthenticationResponse> addNewProfile (@PathVariable("role") String role) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.addNewProfile(role))
                .code(1000)
                .build();
    }

    @GetMapping(value = "/myInfo")
    public ApiResponse<Object> getMyInfo (HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String jwtToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) { // Cookie chứa JWT
                    jwtToken = cookie.getValue();
                    return ApiResponse.builder()
                            .result(authenticationService.getMyInfo(jwtToken))
                            .code(1000)
                            .build();
                }
            }
        }
        throw new AppException(ErrorCode.COOKIE_NOT_FOUND);
    }

    @PostMapping (value = "/log-out")
    public void logout (@RequestBody @Valid LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
    }

    @PostMapping (value = "/refresh")
    public ApiResponse<RefreshResponse> refresh (@RequestBody @Valid RefreshRequest request) throws ParseException, JOSEException {
        return ApiResponse.<RefreshResponse>builder()
                .result(authenticationService.refresh(request))
                .code(1000)
                .build();
    }
}
