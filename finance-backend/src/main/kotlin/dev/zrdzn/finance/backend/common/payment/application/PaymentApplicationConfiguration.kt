package dev.zrdzn.finance.backend.common.payment.application

import dev.zrdzn.finance.backend.common.exchange.ExchangeService
import dev.zrdzn.finance.backend.common.payment.PaymentProductRepository
import dev.zrdzn.finance.backend.common.payment.PaymentService
import dev.zrdzn.finance.backend.common.payment.PaymentRepository
import dev.zrdzn.finance.backend.common.product.ProductService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PaymentApplicationConfiguration(
    private val paymentRepository: PaymentRepository,
    private val paymentProductRepository: PaymentProductRepository,
    private val productService: ProductService,
    private val exchangeService: ExchangeService
) {

    @Bean
    fun paymentFacade(): PaymentService = PaymentService(
        paymentRepository = paymentRepository,
        paymentProductRepository = paymentProductRepository,
        productService = productService,
        exchangeService = exchangeService
    )

}