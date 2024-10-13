package dev.zrdzn.finance.backend.mail

import org.slf4j.LoggerFactory
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender

class MailService(
    private val mailSender: JavaMailSender,
    private val mailFrom: String
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