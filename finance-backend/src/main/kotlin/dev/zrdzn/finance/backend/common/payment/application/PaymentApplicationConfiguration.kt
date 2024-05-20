package dev.zrdzn.finance.backend.common.payment.application

import dev.zrdzn.finance.backend.common.exchange.ExchangeService
import dev.zrdzn.finance.backend.common.payment.PaymentService
import dev.zrdzn.finance.backend.common.payment.PaymentRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PaymentApplicationConfiguration(
    private val paymentRepository: PaymentRepository,
    private val exchangeService: ExchangeService
) {

    @Bean
    fun paymentFacade(): PaymentService = PaymentService(
        paymentRepository = paymentRepository,
        exchangeService = exchangeService
    )

}