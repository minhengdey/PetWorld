package org.example.petworld.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

@Setter
@Getter
@Entity
@Table(name = "service")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "name")
    String name;

    @Column(name = "price")
    int price;

    @Column(name = "used_count")
    int usedCount;

    @Column(name = "rating")
    float rating;

    @Column(name = "discount")
    String discount;

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "deleted_at")
    Date deletedAt;

    @Column(name = "is_deleted")
    boolean isDeleted;

    @Column(name = "updated_at")
    Date updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<AppointmentEntity> appointments = new TreeSet<>();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pet_care_services_id")
    PetCareServicesEntity petCareServices;
}
