package org.example.petworld.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1001, "User existed", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1002, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Email invalid", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1004, "Key invalid", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1005, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    PET_NAME_EXISTED(1007, "Pet name existed", HttpStatus.BAD_REQUEST),
    PET_NOT_FOUND(1008, "Pet not found", HttpStatus.NOT_FOUND),
    INVALID_FRIEND_REQUEST(1009, "Invalid friendship", HttpStatus.BAD_REQUEST),
    FRIENDSHIP_NOT_FOUND(1010, "Friendship not found", HttpStatus.NOT_FOUND),
    APPOINTMENT_NOT_FOUND(1011, "Appointment not found", HttpStatus.NOT_FOUND),
    SERVICE_EXISTED(1012, "Service existed", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_FOUND(1013, "Service not found", HttpStatus.NOT_FOUND),
    ADOPTION_NOT_FOUND(1014, "Adoption not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED(1015, "You do not have permission", HttpStatus.FORBIDDEN),
    ROLE_EXISTED(1016, "Role existed", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1017, "Role not found", HttpStatus.NOT_FOUND),
    PERMISSION_EXISTED(1018, "Permission existed", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(1019, "Permission not found", HttpStatus.NOT_FOUND),
    FILE_UPLOAD_ERROR(1020, "Cannot upload file", HttpStatus.BAD_REQUEST),
    COOKIE_NOT_FOUND(1021, "Cannot find cookie", HttpStatus.NOT_FOUND),
    NOTIFICATION_NOT_FOUND(1022, "Cannot find notification", HttpStatus.NOT_FOUND),
    SEND_REMINDER_ERROR(1023, "Cannot send email reminder", HttpStatus.BAD_REQUEST);

    int code;
    String message;
    HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
