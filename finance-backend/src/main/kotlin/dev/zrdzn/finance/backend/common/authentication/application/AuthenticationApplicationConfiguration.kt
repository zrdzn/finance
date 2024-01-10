package dev.zrdzn.finance.backend.common.authentication.application

import dev.zrdzn.finance.backend.common.authentication.AuthenticationFacade
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AuthenticationApplicationConfiguration {

    @Bean
    fun authenticationFacade(): AuthenticationFacade = AuthenticationFacade()

}