package dev.zrdzn.finance.backend.common.exchange.application

import dev.zrdzn.finance.backend.common.exchange.ExchangeService
import dev.zrdzn.finance.backend.common.exchange.infrastructure.NbpExchangeProvider
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