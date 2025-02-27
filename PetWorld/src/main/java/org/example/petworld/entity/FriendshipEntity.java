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
@Table(name = "friendship")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendshipEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pet1_id")
    PetEntity pet1;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pet2_id")
    PetEntity pet2;

    @Column(name = "is_accepted")
    Boolean isAccepted;

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "deleted_at")
    Date deletedAt;

    @Column(name = "is_deleted")
    Boolean isDeleted;

    @Column(name = "updated_at")
    Date updatedAt;
}
