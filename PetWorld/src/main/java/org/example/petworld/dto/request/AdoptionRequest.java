package org.example.petworld.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdoptionRequest {
    String status;

    Date nextMeetingDate;

    Boolean hasOwnedPetsBefore;

    String petExperience;

    String residenceType;      // Loại hình nhà ở (Chung cư, Nhà riêng, v.v.)

    Boolean hasYard;           // Có sân hay không? (true/false)

    Boolean hasFencedArea;      // Có khu vực rào chắn không? (true/false)

    Boolean hasOtherPets;       // Đang nuôi thú cưng khác không? (true/false)

    String otherPetsDetails;    // Mô tả về thú cưng hiện tại (nếu có)

    String adoptionReason;      // Lý do muốn nhận nuôi

}
