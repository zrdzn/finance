package dev.zrdzn.finance.backend.shared

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class MailService(
    private val mailSender: JavaMailSender,
    @Value("\${spring.mail.from}") private val mailFrom: String
) {

    private val logger = LoggerFactory.getLogger(MailService::class.java)

    fun sendMail(userEmail: String, subject: String, content: String) {
        val message = SimpleMailMessage()

        message.from = mailFrom
        message.setTo(userEmail)
        message.subject = subject
        message.text = content

        try {
            mailSender.send(message)
        } catch (e: Exception) {
            logger.error("Error while sending mail to $userEmail", e)
            return
        }

        logger.info("Mail sent to $userEmail")
    }

}