package org.example.petworld.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.NotificationRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.NotificationResponse;
import org.example.petworld.service.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/notification")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    @PostMapping (value = "/send")
    public ApiResponse<NotificationResponse> sendNotification(@RequestBody NotificationRequest request) {
        return ApiResponse.<NotificationResponse>builder()
                .code(1000)
                .result(notificationService.sendNotification(request))
                .build();
    }

    @GetMapping (value = "/get-all")
    public ApiResponse<List<NotificationResponse>> getUserNotifications() {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<List<NotificationResponse>>builder()
                .code(1000)
                .result(notificationService.getUserNotifications(userId))
                .build();
    }

    @PutMapping (value = "/mark-as-read/{id}")
    public ApiResponse<NotificationResponse> markAsRead (@PathVariable("id") Long id) {
        return ApiResponse.<NotificationResponse>builder()
                .code(1000)
                .result(notificationService.markAsRead(id))
                .build();
    }

    @PutMapping (value = "/read-all")
    public ApiResponse<Void> markAllAsRead () {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        notificationService.markAllAsRead(userId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .build();
    }
}

