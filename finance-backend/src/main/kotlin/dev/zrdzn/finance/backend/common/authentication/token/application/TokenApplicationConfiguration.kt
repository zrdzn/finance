package dev.zrdzn.finance.backend.common.authentication.token.application

import dev.zrdzn.finance.backend.common.authentication.token.TokenService
import dev.zrdzn.finance.backend.common.authentication.token.TokenRepository
import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TokenApplicationConfiguration(
    private val tokenRepository: TokenRepository,
    private val clock: Clock
) {

    @Bean
    fun tokenFacade(): TokenService = TokenService(
        tokenRepository = tokenRepository,
        clock = clock
    )

}