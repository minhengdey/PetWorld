package org.example.petworld.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.*;
import org.example.petworld.dto.response.PetResponse;
import org.example.petworld.dto.response.ServiceResponse;
import org.example.petworld.entity.ServiceEntity;
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
    ServiceService serviceService;
    PetService petService;

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
    public String pets () {
        return "my-pets";
    }

    @GetMapping(value = "/adopt-pets")
    public String adoptPets () {
        return "adopt-pets";
    }

    @GetMapping(value = "/add-pet")
    public String addPet () {
        return "add-pet";
    }

    @GetMapping(value = "/add-service")
    public String addService () {
        return "add-service";
    }

    @GetMapping(value = "/user-profile")
    public String profile () {
        return "user-profile";
    }

    @GetMapping(value = "/pet-care-services-profile")
    public String petCareServicesProfile () {
        return "pet-care-services-profile";
    }

    @GetMapping(value = "/appointments")
    public String appointments () {
        return "appointments";
    }

    @GetMapping(value = "/pet-services")
    public String petServices () {
        return "pet-services";
    }

    @GetMapping(value = "/pet-owner/edit-profile")
    public String editProfile (Model model) {
        model.addAttribute("userUpdate", new PetOwnerRequest());
        return "edit-profile-pet-owner";
    }

    @GetMapping(value = "/pet-care-services/edit-profile")
    public String editProfilePCS (Model model) {
        model.addAttribute("userUpdate", new PetCareServicesRequest());
        return "edit-profile-pet-care-services";
    }

    @GetMapping("/booking-service")
    public String getServiceDetails(@RequestParam("id") Long id, Model model) {
        ServiceResponse service = serviceService.getService(id);
        model.addAttribute("service", service);
        return "booking-service";
    }

    @GetMapping(value = "/find-friend")
    public String findFriend () {
        return "find-friend";
    }

    @GetMapping(value = "/friend-requests")
    public String friendRequests () {
        return "friend-requests";
    }

    @GetMapping(value = "/friends")
    public String friends () {
        return "friends";
    }

    @GetMapping(value = "/appointments-management")
    public String appointmentsManagement () {
        return "appointments-management";
    }

    @GetMapping(value = "/pet-profile")
    public String petProfile () {
        return "pet-profile";
    }

    @GetMapping(value = "/pet-center-profile")
    public String petCenterProfile () {
        return "pet-center-profile";
    }

    @GetMapping(value = "/pets-management")
    public String petsManagement () {
        return "pets-management";
    }

    @GetMapping(value = "/adoption-form")
    public String adoptionForm (@RequestParam("id") Long id, Model model) {
        PetResponse petResponse = petService.getPet(id);
        model.addAttribute("pet", petResponse);
        return "adoption-form";
    }

    @GetMapping(value = "/adoption-requests")
    public String adoptionRequests () {
        return "adoption-requests";
    }
}
