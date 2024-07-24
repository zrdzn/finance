package dev.zrdzn.finance.backend.user.application

import dev.zrdzn.finance.backend.user.UserRepository
import dev.zrdzn.finance.backend.user.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class UserApplicationConfiguration(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Bean
    fun userFacade(): UserService = UserService(
        userRepository = userRepository,
        passwordEncoder = passwordEncoder
    )

}