package org.example.petworld.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.Set;
import java.util.TreeSet;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pet_care_services")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetCareServicesEntity extends UsersEntity {
    @JsonIgnore
    @OneToMany(mappedBy = "petCareServices", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<ServiceEntity> services = new TreeSet<>();
}
