package org.example.petworld.configuration;

import lombok.extern.slf4j.Slf4j;
import org.example.petworld.entity.UsersEntity;
import org.example.petworld.enums.Role;
import org.example.petworld.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;


@Configuration
@Slf4j
public class ApplicationInitConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner init(UsersRepository usersRepository) {
        return args -> {
            if (usersRepository.findByEmailAndRoleAndIsDeleted("admin@gmail.com",
                    Role.ADMIN.name(), false).isEmpty()) {
                UsersEntity users = UsersEntity.builder()
                        .email("admin@gmail.com")
                        .role(Role.ADMIN.name())
                        .password(passwordEncoder.encode("admin"))
                        .isDeleted(false)
                        .createdAt(new Date())
                        .build();
                usersRepository.save(users);
                log.warn("Admin has been created");
            }
        };
    }
}
