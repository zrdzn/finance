package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.price.Price
import dev.zrdzn.finance.backend.product.ProductSpecification
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.transaction.api.TransactionResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleInterval
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleResponse
import java.math.BigDecimal

open class TransactionSpecification : ProductSpecification() {

    protected val transactionService: TransactionService get() = application.getBean(TransactionService::class.java)
    protected val transactionRepository: TransactionRepository get() = application.getBean(TransactionRepository::class.java)
    protected val transactionProductRepository: TransactionProductRepository get() = application.getBean(TransactionProductRepository::class.java)
    protected val scheduleRepository: ScheduleRepository get() = application.getBean(ScheduleRepository::class.java)

    fun createTransaction(
        requesterId: Int,
        vaultId: Int,
        price: Price = Price(
            amount = BigDecimal(100),
            currency = "PLN"
        ),
        description: String = "Test transaction",
        transactionMethod: TransactionMethod = TransactionMethod.CARD,
        transactionType: TransactionType = TransactionType.INCOMING
    ): TransactionResponse =
        transactionService.createTransaction(
            requesterId = requesterId,
            vaultId = vaultId,
            price = price,
            description = description,
            transactionMethod = transactionMethod,
            transactionType = transactionType
        )

    fun createTransactionProduct(
        transactionId: Int,
        productId: Int,
        requesterId: Int,
        unitAmount: BigDecimal,
        quantity: Int
    ): TransactionProductResponse =
        transactionService.createTransactionProduct(
            transactionId = transactionId,
            productId = productId,
            requesterId = requesterId,
            unitAmount = unitAmount,
            quantity = quantity
        )

    fun createSchedule(
        requesterId: Int,
        transactionId: Int,
        description: String = "Test schedule",
        interval: ScheduleInterval = ScheduleInterval.DAY,
        amount: Int = 10
    ): ScheduleResponse =
        transactionService.createSchedule(
            requesterId = requesterId,
            transactionId = transactionId,
            description = description,
            interval = interval,
            amount = amount,
        )

}