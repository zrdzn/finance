package dev.zrdzn.finance.backend.mail

import org.slf4j.LoggerFactory
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender

class MailService(private val mailSender: JavaMailSender) {

    private val logger = LoggerFactory.getLogger(MailService::class.java)

    fun sendMail(userEmail: String, subject: String, content: String) {
        val message = SimpleMailMessage()

        message.from = "MS_R9i07U@trial-o65qngkp8djlwr12.mlsender.net"
        message.setTo(userEmail)
        message.subject = subject
        message.text = content
        mailSender.send(message)

        logger.info("Mail sent to $userEmail")
    }

}