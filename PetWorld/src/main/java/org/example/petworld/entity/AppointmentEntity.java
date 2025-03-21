package org.example.petworld.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Date;


@Entity
@Setter
@Getter
@Table(name = "appointment")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "status")
    String status;

    @Column(name = "preferred-datetime")
    Date preferredDateTime;

    @Column(name = "special-notes")
    String specialNotes;

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "updated_at")
    Date updatedAt;

    @Column(name = "deleted_at")
    Date deletedAt;

    @Column(name = "is_deleted")
    Boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    PetEntity pet;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    ServiceEntity service;
}
