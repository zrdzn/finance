package dev.zrdzn.finance.backend.mail.application

import dev.zrdzn.finance.backend.mail.MailService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender

@Configuration
class MailWebConfiguration(private val mailSender: JavaMailSender) {

    @Bean
    fun mailService(): MailService = MailService(mailSender)

}