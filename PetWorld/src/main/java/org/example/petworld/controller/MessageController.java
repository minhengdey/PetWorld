package org.example.petworld.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.MessageRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.MessageResponse;
import org.example.petworld.service.MessageService;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageController {
    MessageService messageService;

    @PostMapping(value = "/send-message")
    public ApiResponse<MessageResponse> sendMessage (@RequestBody MessageRequest request) {
        return ApiResponse.<MessageResponse>builder()
                .code(1000)
                .result(messageService.sendMessage(request))
                .build();
    }

    @GetMapping(value = "/messages/{contactId}")
    public ApiResponse<List<MessageResponse>> getMessagesBetweenUsers (@PathVariable("contactId") Long contactId) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return ApiResponse.<List<MessageResponse>>builder()
                .result(messageService.getMessagesBetweenUsers(userId, contactId))
                .code(1000)
                .build();
    }
}
