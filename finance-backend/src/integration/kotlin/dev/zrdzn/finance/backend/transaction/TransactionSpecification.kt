package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.product.ProductSpecification
import dev.zrdzn.finance.backend.schedule.ScheduleInterval
import dev.zrdzn.finance.backend.schedule.ScheduleRepository
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.schedule.dto.ScheduleResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionResponse
import java.math.BigDecimal

open class TransactionSpecification : ProductSpecification() {

    protected val transactionService: TransactionService get() = application.getBean(TransactionService::class.java)
    protected val transactionRepository: TransactionRepository get() = application.getBean(TransactionRepository::class.java)
    protected val transactionProductRepository: TransactionProductRepository
        get() = application.getBean(
            TransactionProductRepository::class.java)
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
        transactionType: TransactionType = TransactionType.INCOMING,
        products: Set<TransactionProductCreateRequest> = emptySet()
    ): TransactionResponse =
        transactionService.createTransaction(
            requesterId = requesterId,
            vaultId = vaultId,
            price = price,
            description = description,
            transactionMethod = transactionMethod,
            transactionType = transactionType,
            products = products
        )

    fun createTransactionProduct(
        transactionId: Int,
        name: String,
        categoryId: Int? = null,
        requesterId: Int,
        unitAmount: BigDecimal,
        quantity: Int
    ): TransactionProductResponse =
        transactionService.createTransactionProduct(
            transactionId = transactionId,
            name = name,
            categoryId = categoryId,
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