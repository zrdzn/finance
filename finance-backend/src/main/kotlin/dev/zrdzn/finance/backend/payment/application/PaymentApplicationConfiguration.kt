package dev.zrdzn.finance.backend.payment.application

import dev.zrdzn.finance.backend.exchange.ExchangeService
import dev.zrdzn.finance.backend.payment.PaymentProductRepository
import dev.zrdzn.finance.backend.payment.PaymentRepository
import dev.zrdzn.finance.backend.payment.PaymentService
import dev.zrdzn.finance.backend.product.ProductService
import dev.zrdzn.finance.backend.vault.VaultService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PaymentApplicationConfiguration(
    private val paymentRepository: PaymentRepository,
    private val paymentProductRepository: PaymentProductRepository,
    private val productService: ProductService,
    private val exchangeService: ExchangeService,
    private val vaultService: VaultService
) {

    @Bean
    fun paymentFacade(): PaymentService = PaymentService(
        paymentRepository = paymentRepository,
        paymentProductRepository = paymentProductRepository,
        productService = productService,
        exchangeService = exchangeService,
        vaultService = vaultService
    )

}