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
    @OneToOne
    @JoinColumn(name = "pet_id", unique = true)
    PetEntity pet;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pet_owner_id", nullable = false)
    PetOwnerEntity petOwner;

    @Column(name = "adoption_date")
    Date adoptionDate;

    @Column(name = "next_meeting_date")
    Date nextMeetingDate;

    @Column(name = "has_owned_pets_before")
    Boolean hasOwnedPetsBefore;

    @Column(name = "pet_experience")
    String petExperience;

    @Column(name = "residence_type")
    String residenceType;      // Loại hình nhà ở (Chung cư, Nhà riêng, v.v.)

    @Column(name = "has_yard")
    Boolean hasYard;           // Có sân hay không? (true/false)

    @Column(name = "has_fenced_area")
    Boolean hasFencedArea;      // Có khu vực rào chắn không? (true/false)

    @Column(name = "has_other_pets")
    Boolean hasOtherPets;       // Đang nuôi thú cưng khác không? (true/false)

    @Column(name = "other_pets_details")
    String otherPetsDetails;    // Mô tả về thú cưng hiện tại (nếu có)

    @Column(name = "adoption_reason")
    String adoptionReason;      // Lý do muốn nhận nuôi

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "deleted_at")
    Date deletedAt;

    @Column(name = "is_deleted")
    Boolean isDeleted;

    @Column(name = "updated_at")
    Date updatedAt;
}
