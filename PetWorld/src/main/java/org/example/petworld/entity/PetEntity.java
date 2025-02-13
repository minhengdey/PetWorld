package org.example.petworld.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pet")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetEntity extends BaseUserEntity {
    @Column(name = "dob")
    Date dob;

    @Column(name = "gender")
    String gender;

    @Column(name = "species")
    String species;

    @Column(name = "breed")
    String breed;

    @Column(name = "weight")
    Float weight;

    @Column(name = "is_neutered")
    Boolean isNeutered;

    @Column(name = "is_vaccinated")
    Boolean isVaccinated;

    @Column(name = "color")
    String color;

    @ElementCollection
    @Column (name = "gallery")
    Set<String> gallery;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pet_owner_id")
    PetOwnerEntity petOwner;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "center_id")
    PetCenterEntity petCenter;

    @JsonIgnore
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<AppointmentEntity> appointments = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<AdoptionEntity> adoptions = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pet1", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<FriendshipEntity> friendRequestSent = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pet2", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<FriendshipEntity> friendRequest = new HashSet<>();
}
