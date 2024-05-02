package dev.zrdzn.finance.backend.common.application

import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class FinanceApplicationConfiguration {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder(16)

    @Bean
    fun clock(): Clock = Clock.systemUTC()

}