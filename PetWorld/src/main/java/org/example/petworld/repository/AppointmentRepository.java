package org.example.petworld.repository;

import org.example.petworld.entity.AppointmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    Optional<AppointmentEntity> findByIdAndIsDeleted (Long id, Boolean isDeleted);
    List<AppointmentEntity> findByStatusAndPreferredDateTimeBetween (String status, Date start, Date end);
}
