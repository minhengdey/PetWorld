package org.example.petworld.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "notifications")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "content")
    String message;

    @Column(name = "path")
    String path;

    @Column(name = "is_read")
    Boolean isRead;

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "deleted_at")
    Date deletedAt;

    @Column(name = "is_deleted")
    Boolean isDeleted;

    @Column(name = "updated_at")
    Date updatedAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    BaseUserEntity user;
}
