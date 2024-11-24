package dev.zrdzn.finance.backend.transaction.application

import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.exchange.ExchangeService
import dev.zrdzn.finance.backend.product.ProductService
import dev.zrdzn.finance.backend.transaction.ScheduleRepository
import dev.zrdzn.finance.backend.transaction.TransactionProductRepository
import dev.zrdzn.finance.backend.transaction.TransactionRepository
import dev.zrdzn.finance.backend.transaction.TransactionService
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultService
import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TransactionApplicationConfiguration(
    private val transactionRepository: TransactionRepository,
    private val transactionProductRepository: TransactionProductRepository,
    private val scheduleRepository: ScheduleRepository,
    private val productService: ProductService,
    private val exchangeService: ExchangeService,
    private val vaultService: VaultService,
    private val userService: UserService,
    private val auditService: AuditService,
    private val clock: Clock
) {

    @Bean
    fun transactionService(): TransactionService =
        TransactionService(
            transactionRepository = transactionRepository,
            transactionProductRepository = transactionProductRepository,
            scheduleRepository = scheduleRepository,
            productService = productService,
            exchangeService = exchangeService,
            vaultService = vaultService,
            userService = userService,
            auditService = auditService,
            clock = clock
        )

}