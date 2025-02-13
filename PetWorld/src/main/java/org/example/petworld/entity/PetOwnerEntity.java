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
@Table(name = "pet_owner")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetOwnerEntity extends UsersEntity {

    @JsonIgnore
    @OneToMany(mappedBy = "petOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<PetEntity> pets = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "petOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<AdoptionEntity> adoptions = new HashSet<>();
}
