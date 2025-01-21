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
@Table(name = "adoption")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdoptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "status")
    String status;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    PetEntity pet;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pet_owner_id", nullable = false)
    PetOwnerEntity petOwner;

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "deleted_at")
    Date deletedAt;

    @Column(name = "is_deleted")
    boolean isDeleted;

    @Column(name = "updated_at")
    Date updatedAt;
}
