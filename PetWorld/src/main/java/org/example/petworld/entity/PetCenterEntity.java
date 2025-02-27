package org.example.petworld.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pet_center")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetCenterEntity extends UsersEntity {

    @JsonIgnore
    @OneToMany(mappedBy = "petCenter", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<PetEntity> petsAvailable = new HashSet<>();
}
