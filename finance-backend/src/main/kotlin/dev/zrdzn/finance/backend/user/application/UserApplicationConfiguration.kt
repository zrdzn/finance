package dev.zrdzn.finance.backend.user.application

import dev.zrdzn.finance.backend.mail.MailService
import dev.zrdzn.finance.backend.user.UserProtectionService
import dev.zrdzn.finance.backend.user.UserRepository
import dev.zrdzn.finance.backend.user.UserService
import org.springframework.beans.factory.annotation.Value
import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class UserApplicationConfiguration(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val clock: Clock,
    private val mailService: MailService,
    @Value("\${client.url}") private val clientUrl: String
) {

    @Bean
    fun userService(): UserService = UserService(
        userRepository = userRepository,
        passwordEncoder = passwordEncoder,
        userProtectionService = userProtectionService(),
    )

    @Bean
    fun userProtectionService(): UserProtectionService = UserProtectionService(
        clock = clock,
        mailService = mailService,
    )

}