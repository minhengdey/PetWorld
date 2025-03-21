package org.example.petworld.utils;

import org.example.petworld.entity.AppointmentEntity;
import org.example.petworld.repository.AppointmentRepository;
import org.example.petworld.service.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Component
public class AppointmentReminderScheduler {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private SendEmailService emailService;

    @Scheduled(cron = "0 0 6 * * ?") // Chạy vào 8h sáng mỗi ngày
    public void sendReminders() {
        Date now = new Date();
        Date reminderTime = new Date(Instant.now().plus(1,
                ChronoUnit.DAYS).toEpochMilli()); // Nhắc trước 1 ngày

        List<AppointmentEntity> upcomingAppointments = appointmentRepository.findByStatusAndPreferredDateTimeBetween("Accepted", now, reminderTime);
        System.out.println(upcomingAppointments);
        SimpleDateFormat formatter = new SimpleDateFormat("EEEE, dd/MM/yyyy 'lúc' HH:mm", new Locale("vi", "VN"));


        for (AppointmentEntity appointment : upcomingAppointments) {
            String email = appointment.getPet().getPetOwner().getEmail();
            String formattedDate = formatter.format(appointment.getPreferredDateTime());
            String subject = "🔔 Nhắc lịch hẹn cho thú cưng " + appointment.getPet().getName() + " của bạn!";
            String body = "<p>Xin chào <b>" + appointment.getPet().getPetOwner().getName() + "</b>,</p>" +
                    "<p>Đây là nhắc nhở về lịch hẹn sắp tới của thú cưng!</p>" +
                    "<p>📅 <b>Thời gian:</b> " + formattedDate + "</p>" +
                    "<p>📍 <b>Địa điểm:</b> " + appointment.getService().getPetCareServices().getAddress() + "</p>" +
                    "<p>💼 <b>Dịch vụ:</b> " + appointment.getService().getName() + "</p>" +
                    "<hr>" +
                    "<p>Vui lòng đến đúng giờ để được phục vụ tốt nhất!</p>" +
                    "<p>Cảm ơn bạn đã sử dụng dịch vụ của <b>PetWorld</b>! 🐶🐱</p>";

            emailService.sendReminderEmail(email, subject, body);
        }
    }
}
