package org.example.petworld.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ScreenController {

    @GetMapping(value = "/auth/show-register")
    public String register () {
        return "register";
    }

    @GetMapping(value = "/auth/log-in")
    public String login () {
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
    public String editProfile () {
        return "edit-profile-pet-owner";
    }

    @GetMapping(value = "/pet-care-services/edit-profile")
    public String editProfilePCS () {
        return "edit-profile-pet-care-services";
    }

    @GetMapping(value = "/pet-center/edit-profile")
    public String editProfilePC () {
        return "edit-profile-pet-center";
    }

    @GetMapping("/booking-service")
    public String getServiceDetails() {
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
    public String adoptionForm () {
        return "adoption-form";
    }

    @GetMapping(value = "/adoption-requests")
    public String adoptionRequests () {
        return "adoption-requests";
    }

    @GetMapping(value = "/chat")
    public String chat () {
        return "chat";
    }

    @GetMapping(value = "/edit-pet")
    public String editPet () {
        return "edit-pet";
    }

    @GetMapping(value = "/auth/verify")
    public String verify () {
        return "verify";
    }

    @GetMapping(value = "/admin-dashboard")
    public String adminDashboard () {
        return "admin-dashboard";
    }
}
