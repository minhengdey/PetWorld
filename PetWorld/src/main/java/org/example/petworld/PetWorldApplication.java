package org.example.petworld;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PetWorldApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetWorldApplication.class, args);
    }

}
