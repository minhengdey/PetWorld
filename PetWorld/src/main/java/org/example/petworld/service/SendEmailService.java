package org.example.petworld.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.petworld.enums.ErrorCode;
import org.example.petworld.exception.AppException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SendEmailService {
    JavaMailSender javaMailSender;

    public String sendOtp(String toEmail) throws MessagingException {
        String otp = generateOtp();

        MimeMessage message =javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject("Your OTP Code");
        helper.setText("Your OTP code is: " + otp);

        javaMailSender.send(message);
        return otp;
    }

    public void sendReminderEmail(String to, String subject, String body) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            javaMailSender.send(message);
            System.out.println("Email đã được gửi đến: " + to);
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.SEND_REMINDER_ERROR);
        }
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Mã OTP 6 chữ số
        return String.valueOf(otp);
    }
}