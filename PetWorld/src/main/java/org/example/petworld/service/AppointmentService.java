package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.AppointmentRequest;
import org.example.petworld.dto.request.NotificationRequest;
import org.example.petworld.dto.response.AppointmentResponse;
import org.example.petworld.entity.AppointmentEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.ServiceEntity;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.AppointmentMapper;
import org.example.petworld.repository.AppointmentRepository;
import org.example.petworld.repository.PetRepository;
import org.example.petworld.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppointmentService {
    AppointmentRepository appointmentRepository;
    AppointmentMapper appointmentMapper;
    PetRepository petRepository;
    ServiceRepository serviceRepository;
    NotificationService notificationService;

    public AppointmentResponse createAppointment(AppointmentRequest request, Long serviceId) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(serviceId, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        PetEntity pet = petRepository.findByIdAndIsDeleted(request.getIdPet(), false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        AppointmentEntity appointment = appointmentMapper.toEntity(request);
        appointment.setStatus("Pending");
        appointment.setCreatedAt(new Date());
        appointment.setIsDeleted(false);
        appointment.setPet(pet);
        appointment.setService(service);
        service.getAppointments().add(appointment);
        pet.getAppointments().add(appointment);
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .user(service.getPetCareServices())
                .message(pet.getName() + " has requested to use your service: " + service.getName() + ".")
                .path("http://localhost:8080/appointments-management")
                .build();
        notificationService.sendNotification(notificationRequest);
        return appointmentMapper
                .toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponse getAppointment(Long id) {
        return appointmentMapper.toResponse(appointmentRepository
                .findByIdAndIsDeleted(id, false).orElseThrow(() ->
                        new AppException(ErrorCode.APPOINTMENT_NOT_FOUND)));
    }

    public List<AppointmentResponse> getAllByPetOwnerId(Long petOwnerId) {
        List<AppointmentResponse> appointments = new ArrayList<>();
        List<AppointmentEntity> listAppointments = appointmentRepository.findAll();
        for (AppointmentEntity appointment : listAppointments) {
            if (!appointment.getIsDeleted() && appointment.getPet().getPetOwner().getId().equals(petOwnerId)) {
                appointments.add(appointmentMapper.toResponse(appointment));
            }
        }
        appointments.sort(new Comparator<AppointmentResponse>() {
            @Override
            public int compare(AppointmentResponse o1, AppointmentResponse o2) {
                return o1.getPreferredDateTime().compareTo(o2.getPreferredDateTime());
            }
        });
        return appointments;
    }

    public List<AppointmentResponse> getAllByPetCareServicesId(Long petCareServicesId) {
        List<AppointmentResponse> appointments = new ArrayList<>();
        List<AppointmentEntity> listAppointments = appointmentRepository.findAll();
        for (AppointmentEntity appointment : listAppointments) {
            if (!appointment.getIsDeleted() && !appointment.getStatus().equals("Rejected") &&
                    appointment.getService().getPetCareServices().getId().equals(petCareServicesId)) {
                appointments.add(appointmentMapper.toResponse(appointment));
            }
        }
        appointments.sort(new Comparator<AppointmentResponse>() {
            @Override
            public int compare(AppointmentResponse o1, AppointmentResponse o2) {
                return o1.getPreferredDateTime().compareTo(o2.getPreferredDateTime());
            }
        });
        return appointments;
    }

    public List<AppointmentResponse> getAllAppointment() {
        return appointmentRepository.findAll().stream()
                .map(appointmentMapper::toResponse).toList();
    }

    public AppointmentResponse updateAppointment(AppointmentRequest request, Long id) {
        AppointmentEntity appointment = appointmentRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));
        appointmentMapper.update(appointment, request);
        appointment.setUpdatedAt(new Date());
        if (appointment.getStatus().equals("Accepted")) {
            appointment.getService().setUsedCount(appointment.getService().getUsedCount() + 1);
        }
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .user(appointment.getPet().getPetOwner())
                .message("The appointment for your pet " + appointment.getPet().getName() + " has been updated.")
                .path("http://localhost:8080/appointments")
                .build();
        notificationService.sendNotification(notificationRequest);
        return appointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    public void deleteAppointment(Long id) {
        AppointmentEntity appointment = appointmentRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));
        appointment.setDeletedAt(new Date());
        appointment.setIsDeleted(true);
        appointmentRepository.save(appointment);
    }
}
