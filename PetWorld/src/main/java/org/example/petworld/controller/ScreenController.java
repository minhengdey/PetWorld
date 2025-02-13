package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.*;
import org.example.petworld.service.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ScreenController {
    AuthenticationService authenticationService;

    @GetMapping(value = "/auth/show-register")
    public String register (Model model) {
        model.addAttribute("userCreation", new UserCreationRequest());
        return "register";
    }

    @PostMapping(value = "/auth/process-register")
    public String handleRegister (@Valid @ModelAttribute("userCreation") UserCreationRequest request,
                            BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "register";
        }
        authenticationService.register(request);
        System.out.println(request.getAvatar());
        redirectAttributes.addAttribute("message", "Đăng ký thành công");
        return "redirect:/auth/log-in";
    }

    @GetMapping(value = "/auth/log-in")
    public String login (Model model) {
        model.addAttribute("user", new AuthenticationRequest());
        return "log-in";
    }

    @GetMapping(value = "/")
    public String index () {
        return "index";
    }

    @GetMapping(value = "/home")
    public String home () {
        return "home";
    }

    @GetMapping(value = "/my-pets")
    public String petOwnerPets () {
        return "my-pets";
    }

    @GetMapping(value = "/add-pet")
    public String addPet (Model model) {
        model.addAttribute("pet", new PetRequest());
        return "add-pet";
    }

    @GetMapping(value = "/find-friend")
    public String findFriend () {
        return "find-friend";
    }

    @GetMapping(value = "/user-profile")
    public String profile () {
        return "user-profile";
    }

    @GetMapping(value = "/pet-owner/edit-profile")
    public String editProfile (Model model) {
        model.addAttribute("userUpdate", new PetOwnerRequest());
        return "edit-profile-pet-owner";
    }
}
