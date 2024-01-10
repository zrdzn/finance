package dev.zrdzn.finance.backend.common.user.application

import dev.zrdzn.finance.backend.common.user.UserFacade
import dev.zrdzn.finance.backend.common.user.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class UserApplicationConfiguration(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Bean
    fun userFacade(): UserFacade = UserFacade(
        userRepository = userRepository,
        passwordEncoder = passwordEncoder
    )

}