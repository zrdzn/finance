package dev.zrdzn.finance.backend.common.payment.application

import dev.zrdzn.finance.backend.common.payment.PaymentPriceRepository
import dev.zrdzn.finance.backend.common.payment.PaymentService
import dev.zrdzn.finance.backend.common.payment.PaymentRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PaymentApplicationConfiguration(
    private val paymentRepository: PaymentRepository,
    private val paymentPriceRepository: PaymentPriceRepository
) {

    @Bean
    fun paymentFacade(): PaymentService = PaymentService(
        paymentRepository = paymentRepository,
        paymentPriceRepository = paymentPriceRepository
    )

}