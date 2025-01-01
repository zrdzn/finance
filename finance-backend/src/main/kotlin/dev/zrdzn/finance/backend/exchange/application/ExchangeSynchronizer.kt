package dev.zrdzn.finance.backend.exchange.application

import java.util.concurrent.TimeUnit
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class ExchangeSynchronizer(
    private val exchangeService: ExchangeService
) {

    private val logger = LoggerFactory.getLogger(ExchangeSynchronizer::class.java)

    @Scheduled(fixedRate = 25, timeUnit = TimeUnit.HOURS)
    fun synchronizeExchangeRates() {
        logger.info("Synchronizing exchange rates")
        exchangeService.synchronizeExchangeRates()
    }

}