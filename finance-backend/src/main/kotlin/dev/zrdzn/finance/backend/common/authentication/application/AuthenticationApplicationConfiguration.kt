package dev.zrdzn.finance.backend.common.authentication.application

import dev.zrdzn.finance.backend.common.authentication.AuthenticationService
import dev.zrdzn.finance.backend.common.authentication.token.TokenService
import dev.zrdzn.finance.backend.common.user.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class AuthenticationApplicationConfiguration(
    private val userService: UserService,
    private val tokenService: TokenService,
    private val passwordEncoder: PasswordEncoder
) {

    @Bean
    fun authenticationFacade(): AuthenticationService = AuthenticationService(
        userService = userService,
        tokenService = tokenService,
        passwordEncoder = passwordEncoder
    )

}