package org.example.petworld.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.example.petworld.dto.request.AuthenticationRequest;
import org.example.petworld.dto.request.LogoutRequest;
import org.example.petworld.dto.request.RefreshRequest;
import org.example.petworld.dto.request.UserCreationRequest;
import org.example.petworld.dto.response.ApiResponse;
import org.example.petworld.dto.response.AuthenticationResponse;
import org.example.petworld.dto.response.RefreshResponse;
import org.example.petworld.dto.response.UserResponse;
import org.example.petworld.entity.*;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.example.petworld.mapper.*;
import org.example.petworld.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    PetOwnerRepository petOwnerRepository;
    PetOwnerMapper petOwnerMapper;
    PetCenterRepository petCenterRepository;
    PetCenterMapper petCenterMapper;
    PetCareServicesRepository petCareServicesRepository;
    PetCareServicesMapper petCareServicesMapper;
    PetRepository petRepository;
    PetMapper petMapper;
    UsersRepository usersRepository;
    PasswordEncoder passwordEncoder;
    PetOwnerService petOwnerService;
    PetCenterService petCenterService;
    PetCareServicesService petCareServicesService;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    public static final String SIGNER_KEY =
            "YD8HzTlo8PGQ4jbvy8JzRWDEPHj3ESBodMOy2VN18m34naEMGKl3PvThviChOLfY";
    private final UsersMapper usersMapper;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        boolean authenticated;
        UsersEntity users = usersRepository.findByEmailAndIsDeleted(request.getEmail(), false)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        authenticated = passwordEncoder.matches(request.getPassword(), users.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(generateToken(users))
                .build();
    }

    public UserResponse register(UserCreationRequest request) {
        return switch (request.getRole()) {
            case "PET_OWNER" -> petOwnerService.createProfile(request);
            case "PET_CENTER" -> petCenterService.createProfile(request);
            case "PET_CARE_SERVICES" -> petCareServicesService.createProfile(request);
            default -> throw new AppException(ErrorCode.UNAUTHENTICATED);
        };
    }

    public AuthenticationResponse swapPet(Long id) {
        String role = String.valueOf(SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities());
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        PetEntity pet = petRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        if (role.equals("[ROLE_PET]")) {
            PetEntity pet1 = petRepository.findByIdAndIsDeleted(userId, false)
                    .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
            if (pet.getPetOwner() != pet1.getPetOwner()) {
                throw new AppException(ErrorCode.PET_NOT_FOUND);
            }
        } else if (!pet.getPetOwner().getId().equals(userId)) {
                throw new AppException(ErrorCode.PET_NOT_FOUND);
        }
        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(generateToken(pet))
                .build();
    }

    public AuthenticationResponse addNewProfile(String newRole) {
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        System.out.println(userId);
        UsersEntity users = usersRepository.findByIdAndIsDeleted(userId, false).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        UserCreationRequest request = usersMapper.toRequest(users);
        request.setRole(newRole);
        UserResponse response = register(request);
        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(generateToken(UsersEntity.builder()
                        .id(response.getId())
                        .name(response.getName())
                        .role(response.getRole())
                        .build()))
                .build();
    }

    public Object getMyInfo () {
        String role = String.valueOf(SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities());
        Long userId = Long.valueOf(((JwtAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication()).getToken().getSubject());
        return switch (role) {
            case "[ROLE_PET_OWNER]" ->
                    petOwnerMapper.toPetOwnerResponse(petOwnerRepository.findByIdAndIsDeleted(userId, false)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
            case "[ROLE_PET_CENTER]" ->
                    petCenterMapper.toPetCenterResponse(petCenterRepository.findByIdAndIsDeleted(userId, false)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
            case "[ROLE_PET_CARE_SERVICES]" ->
                    petCareServicesMapper.toPetCareServicesResponse(petCareServicesRepository.findByIdAndIsDeleted(userId, false)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
            case "[ROLE_PET]" -> petMapper.toPetResponse(petRepository.findByIdAndIsDeleted(userId, false)
                    .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND)));
            default -> throw new AppException(ErrorCode.UNAUTHENTICATED);
        };
    }

    public SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY);
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(verifier);
        if (!(verified && expiration.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }

    public void logout(LogoutRequest logoutRequest) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(logoutRequest.getToken());
        String id = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        invalidatedTokenRepository.save(InvalidatedTokenEntity.builder()
                .id(id)
                .expiryTime(expiryTime)
                .build());
    }

    public RefreshResponse refresh(RefreshRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getToken());
        String id = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Long userId = Long.valueOf(signedJWT.getJWTClaimsSet().getSubject());
        UsersEntity user = usersRepository.findByIdAndIsDeleted(userId, false).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        invalidatedTokenRepository.save(InvalidatedTokenEntity.builder()
                .id(id)
                .expiryTime(expiryTime)
                .build());
        String token = generateToken(user);
        return RefreshResponse.builder()
                .token(token)
                .success(true)
                .build();
    }

    public String generateToken(Object user) {
        JWSHeader header;
        JWTClaimsSet jwtClaimsSet;
        if (user instanceof UsersEntity) {
            header = new JWSHeader(JWSAlgorithm.HS512);
            jwtClaimsSet = new JWTClaimsSet.Builder()
                    .issuer("pet-world.com")
                    .subject(String.valueOf(((UsersEntity) user).getId()))
                    .issueTime(new Date())
                    .expirationTime(new Date(Instant.now()
                            .plus(1, ChronoUnit.HOURS).toEpochMilli()))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", ((UsersEntity) user).getRole())
                    .build();
        } else if (user instanceof PetEntity) {
            header = new JWSHeader(JWSAlgorithm.HS512);
            jwtClaimsSet = new JWTClaimsSet.Builder()
                    .issuer("pet-world.com")
                    .subject(String.valueOf(((PetEntity) user).getId()))
                    .issueTime(new Date())
                    .expirationTime(new Date(Instant.now()
                            .plus(1, ChronoUnit.HOURS).toEpochMilli()))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", ((PetEntity) user).getRole())
                    .build();
        } else {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Can not generate token", e);
            throw new RuntimeException(e);
        }
    }
}
