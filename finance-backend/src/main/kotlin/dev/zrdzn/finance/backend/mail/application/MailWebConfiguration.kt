package dev.zrdzn.finance.backend.mail.application

import dev.zrdzn.finance.backend.mail.MailService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender

@Configuration
class MailWebConfiguration(
    private val mailSender: JavaMailSender,
    @Value("\${spring.mail.from}") private val mailFrom: String
) {

    @Bean
    fun mailService(): MailService = MailService(mailSender, mailFrom)

}