package org.example.petworld.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

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
    float weight;

    @Column(name = "path_profile_image")
    String pathProfileImage;

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
    Set<AppointmentEntity> appointments = new TreeSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<AdoptionEntity> adoptions = new TreeSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pet1", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<FriendshipEntity> friendRequestSent = new TreeSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pet2", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<FriendshipEntity> friendRequest = new TreeSet<>();

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "deleted_at")
    Date deletedAt;

    @Column(name = "is_deleted")
    boolean isDeleted;

    @Column(name = "updated_at")
    Date updatedAt;
}
