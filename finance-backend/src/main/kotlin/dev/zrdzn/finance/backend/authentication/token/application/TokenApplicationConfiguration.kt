package dev.zrdzn.finance.backend.authentication.token.application

import dev.zrdzn.finance.backend.authentication.token.TokenRepository
import dev.zrdzn.finance.backend.authentication.token.TokenService
import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TokenApplicationConfiguration(
    private val tokenRepository: TokenRepository,
    private val clock: Clock
) {

    @Bean
    fun tokenService(): TokenService = TokenService(
        tokenRepository = tokenRepository,
        clock = clock
    )

}