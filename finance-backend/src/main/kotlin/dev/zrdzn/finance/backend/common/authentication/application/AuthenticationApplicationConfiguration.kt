package dev.zrdzn.finance.backend.common.authentication.application

import dev.zrdzn.finance.backend.common.authentication.AuthenticationFacade
import dev.zrdzn.finance.backend.common.authentication.token.TokenFacade
import dev.zrdzn.finance.backend.common.user.UserFacade
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class AuthenticationApplicationConfiguration(
    private val userFacade: UserFacade,
    private val tokenFacade: TokenFacade,
    private val passwordEncoder: PasswordEncoder
) {

    @Bean
    fun authenticationFacade(): AuthenticationFacade = AuthenticationFacade(
        userFacade = userFacade,
        tokenFacade = tokenFacade,
        passwordEncoder = passwordEncoder
    )

}