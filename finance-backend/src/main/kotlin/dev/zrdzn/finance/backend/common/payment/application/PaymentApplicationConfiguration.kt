package dev.zrdzn.finance.backend.common.payment.application

import dev.zrdzn.finance.backend.common.payment.PaymentFacade
import dev.zrdzn.finance.backend.common.payment.PaymentRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PaymentApplicationConfiguration(
    private val paymentRepository: PaymentRepository
) {

    @Bean
    fun paymentFacade(): PaymentFacade = PaymentFacade(
        paymentRepository = paymentRepository
    )

}