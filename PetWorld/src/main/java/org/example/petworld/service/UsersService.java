package org.example.petworld.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.mapper.UsersMapper;
import org.example.petworld.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsersService {
    UsersRepository usersRepository;
    UsersMapper usersMapper;

    public List<UserResponse> getAllUser() {
        return usersRepository.findAll()
                .stream().map(usersMapper::toUserResponse).toList();
    }
}
