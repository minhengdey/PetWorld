package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.request.AppointmentRequest;
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

import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppointmentService {
    AppointmentRepository appointmentRepository;
    AppointmentMapper appointmentMapper;
    PetRepository petRepository;
    ServiceRepository serviceRepository;

    public AppointmentResponse createAppointment(AppointmentRequest request, Long petId, Long serviceId) {
        ServiceEntity service = serviceRepository.findByIdAndIsDeleted(serviceId, false)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        PetEntity pet = petRepository.findByIdAndIsDeleted(petId, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        AppointmentEntity appointment = appointmentMapper.toEntity(request);
        appointment.setCreatedAt(new Date());
        appointment.setDeleted(false);
        appointment.setPet(pet);
        appointment.setService(service);
        service.getAppointments().add(appointment);
        pet.getAppointments().add(appointment);
        return appointmentMapper
                .toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponse getAppointment(Long id) {
        return appointmentMapper.toResponse(appointmentRepository
                .findByIdAndIsDeleted(id, false).orElseThrow(() ->
                        new AppException(ErrorCode.APPOINTMENT_NOT_FOUND)));
    }

    public AppointmentResponse updateAppointment(AppointmentRequest request, Long id) {
        AppointmentEntity appointment = appointmentRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));
        appointmentMapper.update(appointment, request);
        appointment.setUpdatedAt(new Date());
        return appointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    public void deleteAppointment(Long id) {
        AppointmentEntity appointment = appointmentRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));
        appointment.setDeletedAt(new Date());
        appointment.setDeleted(true);
        appointmentRepository.save(appointment);
    }
}
