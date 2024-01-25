package dev.zrdzn.finance.backend.common.authentication.token.application

import dev.zrdzn.finance.backend.common.authentication.token.TokenFacade
import dev.zrdzn.finance.backend.common.authentication.token.TokenRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TokenApplicationConfiguration(
    private val tokenRepository: TokenRepository
) {

    @Bean
    fun tokenFacade(): TokenFacade = TokenFacade(tokenRepository)

}