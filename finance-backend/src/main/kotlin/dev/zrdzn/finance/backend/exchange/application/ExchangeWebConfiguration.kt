package dev.zrdzn.finance.backend.exchange.application

import dev.zrdzn.finance.backend.exchange.ExchangeService
import dev.zrdzn.finance.backend.exchange.infrastructure.NbpExchangeProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ExchangeWebConfiguration {

    @Bean
    fun exchangeService(): ExchangeService =
        ExchangeService(
            exchangeProvider = NbpExchangeProvider()
        )

}