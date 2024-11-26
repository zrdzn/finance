package dev.zrdzn.finance.backend.transaction

import com.opencsv.CSVWriter
import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.exchange.ExchangeService
import dev.zrdzn.finance.backend.product.ProductService
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.api.*
import dev.zrdzn.finance.backend.transaction.api.flow.TransactionFlowsResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleInterval
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleListResponse
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleNotFoundException
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleResponse
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission
import org.springframework.transaction.annotation.Transactional
import java.io.StringWriter
import java.math.BigDecimal
import java.time.Clock
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

open class TransactionService(
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

    @Transactional
    open fun exportTransactionsToCsv(requesterId: Int, vaultId: Int, startDate: Instant, endDate: Instant): String {
        val transactions = getTransactions(requesterId, vaultId, startDate, endDate).transactions

        val writer = StringWriter()
        val csvWriter = CSVWriter(writer)

        val headers = arrayOf("Payer Email", "Vault Name", "Transaction Date", "Transaction Method", "Transaction Type", "Description", "Total", "Currency")
        csvWriter.writeNext(headers)

        transactions.forEach {
            val createdAtLocalDateTime = Instant.ofEpochSecond(it.createdAt.epochSecond)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime()

            val data = arrayOf(
                userService.getUser(it.userId).email,
                vaultService.getVault(vaultId = vaultId, requesterId = requesterId).name,
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(createdAtLocalDateTime),
                it.transactionMethod.toString(),
                it.transactionType.toString(),
                it.description ?: "",
                it.total.toString(),
                it.currency
            )

            csvWriter.writeNext(data)
        }

        csvWriter.close()

        auditService.createAudit(
            vaultId = vaultId,
            userId = requesterId,
            auditAction = AuditAction.TRANSACTION_EXPORTED,
            description = "Transactions amount ${transactions.size}"
        )

        return writer.toString()
    }

    @Transactional
    open fun executeSchedules() {
        val now = Instant.now(clock)

        scheduleRepository.findByNextExecutionBefore(now).forEach { schedule ->
            val transaction = transactionRepository.findById(schedule.transactionId) ?: throw TransactionNotFoundException()

            val newTransaction = transactionRepository.save(
                Transaction(
                    id = null,
                    userId = transaction.userId,
                    vaultId = transaction.vaultId,
                    createdAt = Instant.now(clock),
                    transactionMethod = transaction.transactionMethod,
                    transactionType = transaction.transactionType,
                    description = transaction.description,
                    total = transaction.total,
                    currency = transaction.currency
                )
            )

            transactionProductRepository.findByTransactionId(transaction.id!!).forEach {
                transactionProductRepository.save(
                    TransactionProduct(
                        id = null,
                        transactionId = newTransaction.id!!,
                        productId = it.productId,
                        unitAmount = it.unitAmount,
                        quantity = it.quantity
                    )
                )
            }

            schedule.nextExecution = calculateNextExecutionDate(schedule.scheduleInterval, schedule.intervalValue)
        }
    }

    @Transactional
    open fun createTransaction(
        requesterId: Int,
        vaultId: Int,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String,
        price: Price
    ): TransactionResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_CREATE)

        if (description.isEmpty()) {
            throw TransactionDescriptionRequiredException()
        }

        return transactionRepository
            .save(
                Transaction(
                    id = null,
                    userId = requesterId,
                    vaultId = vaultId,
                    createdAt = Instant.now(clock),
                    transactionMethod = transactionMethod,
                    transactionType = transactionType,
                    description = description,
                    total = price.amount,
                    currency = price.currency
                )
            )
            .also {
                auditService.createAudit(
                    vaultId = vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.TRANSACTION_CREATED,
                    description = description
                )
            }
            .let { it.toResponse(exchangeService.convertCurrency(it.total, it.currency, "PLN").amount) }
    }

    @Transactional
    open fun createTransactionProduct(
        requesterId: Int,
        transactionId: Int,
        productId: Int,
        unitAmount: BigDecimal,
        quantity: Int
    ): TransactionProductResponse {
        val product = productService.getProduct(requesterId, productId)

        vaultService.authorizeMember(product.vaultId, requesterId, VaultPermission.TRANSACTION_CREATE)

        return transactionProductRepository
            .save(
                TransactionProduct(
                    id = null,
                    transactionId = transactionId,
                    productId = productId,
                    unitAmount = unitAmount,
                    quantity = quantity,
                )
            )
            .also {
                auditService.createAudit(
                    vaultId = product.vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.TRANSACTION_PRODUCT_CREATED,
                    description = product.name
                )
            }
            .toResponse(productService.getProduct(requesterId, productId))
    }

    @Transactional
    open fun createSchedule(requesterId: Int, transactionId: Int, description: String, interval: ScheduleInterval, amount: Int): ScheduleResponse {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundException()

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.SCHEDULE_CREATE)

        val nextExecutionDate = calculateNextExecutionDate(interval, amount)

        val schedule = scheduleRepository.save(
            Schedule(
                id = null,
                transactionId = transaction.id!!,
                description = description,
                nextExecution = nextExecutionDate,
                scheduleInterval = interval,
                intervalValue = amount
            )
        )

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = requesterId,
            auditAction = AuditAction.SCHEDULE_CREATED,
            description = description
        )

        return ScheduleResponse(
            id = schedule.id!!,
            transactionId = schedule.transactionId,
            description = schedule.description,
            nextExecution = schedule.nextExecution,
            interval = schedule.scheduleInterval,
            amount = schedule.intervalValue
        )
    }

    @Transactional
    open fun updateTransaction(
        requesterId: Int,
        transactionId: Int,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String?,
        price: Price
    ) {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundException()

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_UPDATE)

        transaction.transactionMethod = transactionMethod
        transaction.transactionType = transactionType
        transaction.description = description
        transaction.total = price.amount
        transaction.currency = price.currency

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = requesterId,
            auditAction = AuditAction.TRANSACTION_UPDATED,
            description = description ?: "Transaction ID $transactionId"
        )
    }

    @Transactional
    open fun deleteTransaction(transactionId: Int) {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundException()

        vaultService.authorizeMember(transaction.vaultId, transaction.userId, VaultPermission.TRANSACTION_DELETE)

        transactionRepository.deleteById(transactionId)

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = transaction.userId,
            auditAction = AuditAction.TRANSACTION_DELETED,
            description = transaction.description ?: "Transaction ID $transactionId"
        )
    }

    @Transactional(readOnly = true)
    open fun getTransactions(requesterId: Int, vaultId: Int): TransactionListResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
            .findByVaultId(vaultId)
            .map { it.toResponse(exchangeService.convertCurrency(it.total, it.currency, "PLN").amount) }
            .toSet()
            .let { TransactionListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getTransactions(requesterId: Int, vaultId: Int, startDate: Instant, endDate: Instant): TransactionListResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
            .findByVaultIdAndCreatedAtBetween(vaultId, startDate, endDate)
            .map { it.toResponse(exchangeService.convertCurrency(it.total, it.currency, "PLN").amount) }
            .toSet()
            .let { TransactionListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getTransaction(requesterId: Int, transactionId: Int): TransactionResponse {
        val transaction = transactionRepository.findById(transactionId)
            ?.let { it.toResponse(exchangeService.convertCurrency(it.total, it.currency, "PLN").amount) }
            ?: throw TransactionNotFoundException()

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transaction
    }

    @Transactional(readOnly = true)
    open fun getTransactionsAmount(requesterId: Int, vaultId: Int): TransactionAmountResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
            .countByVaultId(vaultId)
            .let { TransactionAmountResponse(it.toInt()) }
    }

    @Transactional(readOnly = true)
    open fun getTransactionProducts(requesterId: Int, transactionId: Int): TransactionProductListResponse {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundException()

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionProductRepository
            .findByTransactionId(transactionId)
            .map {
                TransactionProductResponse(
                    id = it.id!!,
                    transactionId = it.transactionId,
                    product = productService.getProduct(requesterId, it.productId),
                    unitAmount = it.unitAmount,
                    quantity = it.quantity
                )
            }
            .toSet()
            .let { TransactionProductListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getSchedules(requesterId: Int, vaultId: Int): ScheduleListResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.SCHEDULE_READ)

        return scheduleRepository
            .findByVaultId(vaultId)
            .map {
                ScheduleResponse(
                    id = it.id!!,
                    transactionId = it.transactionId,
                    description = it.description,
                    nextExecution = it.nextExecution,
                    interval = it.scheduleInterval,
                    amount = it.intervalValue
                )
            }
            .toSet()
            .let { ScheduleListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getScheduleForcefully(scheduleId: Int): ScheduleResponse =
        scheduleRepository.findById(scheduleId)
            ?.let {
                ScheduleResponse(
                    id = it.id!!,
                    transactionId = it.transactionId,
                    description = it.description,
                    nextExecution = it.nextExecution,
                    interval = it.scheduleInterval,
                    amount = it.intervalValue
                )
            }
            ?: throw ScheduleNotFoundException()

    @Transactional(readOnly = true)
    open fun getTransactionFlows(requesterId: Int, vaultId: Int, transactionType: TransactionType?, currency: String, start: Instant): TransactionFlowsResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.DETAILS_READ)

        // if transaction type is not provided, calculate balance
        if (transactionType == null) {
            val income = calculateFlowsByType(vaultId, TransactionType.INCOMING, start, currency)
            val outcome = calculateFlowsByType(vaultId, TransactionType.OUTGOING, start, currency)

            return TransactionFlowsResponse(
                Price(
                    amount = income - outcome,
                    currency = currency
                )
            )
        }

        return TransactionFlowsResponse(
            Price(
                amount = calculateFlowsByType(vaultId, transactionType, start, currency),
                currency = currency
            )
        )
    }

    @Transactional
    open fun deleteSchedule(requesterId: Int, scheduleId: Int) {
        val schedule = getScheduleForcefully(scheduleId)
        val transaction = getTransaction(requesterId, schedule.transactionId)

        scheduleRepository.deleteById(scheduleId)

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = requesterId,
            auditAction = AuditAction.SCHEDULE_DELETED,
            description = schedule.description
        )
    }

    private fun calculateNextExecutionDate(interval: ScheduleInterval, amount: Int): Instant {
        val now = Instant.now(clock)
        val convertedAmount = amount.toLong()
        return when (interval) {
            ScheduleInterval.HOUR -> now.plus(convertedAmount, ChronoUnit.HOURS)
            ScheduleInterval.DAY -> now.plus(convertedAmount, ChronoUnit.DAYS)
            ScheduleInterval.WEEK -> now.plus(convertedAmount * 7, ChronoUnit.DAYS)
            ScheduleInterval.MONTH -> now.plus(convertedAmount * 30, ChronoUnit.DAYS)
            ScheduleInterval.YEAR -> now.plus(convertedAmount * 365, ChronoUnit.DAYS)
        }
    }

    private fun calculateFlowsByType(
        vaultId: Int,
        transactionType: TransactionType,
        start: Instant,
        targetCurrency: String
    ): BigDecimal {
        return transactionRepository.sumAndGroupFlowsByVaultIdAndTransactionType(vaultId, transactionType, start)
            .sumOf {
                exchangeService.convertCurrency(
                    amount = it.amount,
                    source = it.currency,
                    target = targetCurrency
                ).amount
            }
    }

}
