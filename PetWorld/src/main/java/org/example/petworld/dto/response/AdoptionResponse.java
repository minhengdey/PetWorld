package org.example.petworld.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.petworld.entity.PetCenterEntity;
import org.example.petworld.entity.PetEntity;
import org.example.petworld.entity.PetOwnerEntity;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdoptionResponse {
    Long id;

    String status;

    PetEntity pet;

    PetOwnerEntity petOwner;

    Date adoptionDate;

    Date nextMeetingDate;

    Boolean hasOwnedPetsBefore;

    String petExperience;

    String residenceType;      // Loại hình nhà ở (Chung cư, Nhà riêng, v.v.)

    Boolean hasYard;           // Có sân hay không? (true/false)

    Boolean hasFencedArea;      // Có khu vực rào chắn không? (true/false)

    Boolean hasOtherPets;       // Đang nuôi thú cưng khác không? (true/false)

    String otherPetsDetails;    // Mô tả về thú cưng hiện tại (nếu có)

    String adoptionReason;      // Lý do muốn nhận nuôi

    Date createdAt;

    Date deletedAt;

    Boolean isDeleted;

    Date updatedAt;
}
