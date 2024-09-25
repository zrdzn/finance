package dev.zrdzn.finance.backend.transaction

import com.opencsv.CSVWriter
import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.exchange.ExchangeService
import dev.zrdzn.finance.backend.product.ProductId
import dev.zrdzn.finance.backend.product.ProductService
import dev.zrdzn.finance.backend.product.api.ProductNotFoundException
import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.api.TransactionAmountResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionCreateResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionListResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.transaction.api.TransactionNotFoundException
import dev.zrdzn.finance.backend.transaction.api.TransactionResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import dev.zrdzn.finance.backend.transaction.api.flow.TransactionFlowsResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductCreateResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductWithProductResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.VaultPermission
import java.io.StringWriter
import java.math.BigDecimal
import java.time.Clock
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional

open class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val transactionProductRepository: TransactionProductRepository,
    private val productService: ProductService,
    private val exchangeService: ExchangeService,
    private val vaultService: VaultService,
    private val userService: UserService,
    private val auditService: AuditService,
    private val clock: Clock
) {

    private val logger = LoggerFactory.getLogger(TransactionService::class.java)

    @Transactional
    open fun exportTransactionsToCsv(requesterId: UserId, vaultId: VaultId, startDate: Instant, endDate: Instant): String {
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
                userService.getUserById(it.userId).email,
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
    open fun createTransaction(
        requesterId: UserId,
        vaultId: VaultId,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String?,
        price: Price
    ): TransactionCreateResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_CREATE)

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
            .also { logger.info("Successfully created new transaction: $it") }
            .also {
                auditService.createAudit(
                    vaultId = vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.TRANSACTION_CREATED,
                    description = description ?: "Transaction ID ${it.id}"
                )
            }
            .let { TransactionCreateResponse(id = it.id!!) }
    }

    @Transactional
    open fun createTransactionProduct(
        requesterId: UserId,
        transactionId: TransactionId,
        productId: ProductId,
        unitAmount: BigDecimal,
        quantity: Int
    ): TransactionProductCreateResponse {
        val product = productService.getProductById(requesterId, productId)

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
            .also { logger.info("Successfully created new transaction product: $it") }
            .also {
                auditService.createAudit(
                    vaultId = product.vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.TRANSACTION_PRODUCT_CREATED,
                    description = product.name
                )
            }
            .let { TransactionProductCreateResponse(id = it.id!!) }
    }

    @Transactional
    open fun updateTransaction(requesterId: UserId, transactionId: TransactionId, transactionMethod: TransactionMethod,
                               transactionType: TransactionType, description: String?, price: Price) {
        val transaction = transactionRepository.findById(transactionId) ?: throw ProductNotFoundException(transactionId)

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_UPDATE)

        transaction.transactionMethod = transactionMethod
        transaction.transactionType = transactionType
        transaction.description = description
        transaction.total = price.amount
        transaction.currency = price.currency
        logger.info("Successfully updated transaction: $transaction")

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = requesterId,
            auditAction = AuditAction.TRANSACTION_UPDATED,
            description = description ?: "Transaction ID $transactionId"
        )
    }

    @Transactional
    open fun deleteTransaction(transactionId: TransactionId) {
        val transaction = transactionRepository.findById(transactionId) ?: throw ProductNotFoundException(transactionId)

        vaultService.authorizeMember(transaction.vaultId, transaction.userId, VaultPermission.TRANSACTION_DELETE)

        transactionRepository.deleteById(transactionId)

        logger.info("Successfully deleted transaction with id: $transactionId")

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = transaction.userId,
            auditAction = AuditAction.TRANSACTION_DELETED,
            description = transaction.description ?: "Transaction ID $transactionId"
        )
    }

    @Transactional(readOnly = true)
    open fun getTransactions(requesterId: UserId, vaultId: VaultId): TransactionListResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
            .findByVaultId(vaultId)
            .map {
                TransactionResponse(
                    id = it.id!!,
                    userId = it.userId,
                    vaultId = it.vaultId,
                    createdAt = it.createdAt,
                    transactionMethod = it.transactionMethod,
                    transactionType = it.transactionType,
                    description = it.description,
                    totalInVaultCurrency = exchangeService.convertCurrency(
                        amount = it.total,
                        source = it.currency,
                        target = "PLN"
                    ).amount,
                    total = it.total,
                    currency = it.currency
                )
            }
            .toSet()
            .let { TransactionListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getTransactions(requesterId: UserId, vaultId: VaultId, startDate: Instant, endDate: Instant): TransactionListResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
            .findByVaultIdAndCreatedAtBetween(vaultId, startDate, endDate)
            .map {
                TransactionResponse(
                    id = it.id!!,
                    userId = it.userId,
                    vaultId = it.vaultId,
                    createdAt = it.createdAt,
                    transactionMethod = it.transactionMethod,
                    transactionType = it.transactionType,
                    description = it.description,
                    totalInVaultCurrency = exchangeService.convertCurrency(
                        amount = it.total,
                        source = it.currency,
                        target = "PLN"
                    ).amount,
                    total = it.total,
                    currency = it.currency
                )
            }
            .toSet()
            .let { TransactionListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getTransactionsAmount(requesterId: UserId, vaultId: VaultId): TransactionAmountResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
            .countByVaultId(vaultId)
            .let { TransactionAmountResponse(it.toInt()) }
    }

    @Transactional(readOnly = true)
    open fun getTransactionProducts(requesterId: UserId, transactionId: TransactionId): TransactionProductListResponse {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundException(transactionId)

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionProductRepository
            .findByTransactionId(transactionId)
            .map {
                TransactionProductWithProductResponse(
                    id = it.id!!,
                    transactionId = it.transactionId,
                    product = productService.getProductById(requesterId, it.productId),
                    unitAmount = it.unitAmount,
                    quantity = it.quantity
                )
            }
            .toSet()
            .let { TransactionProductListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getTransactionFlows(requesterId: UserId, vaultId: VaultId, transactionType: TransactionType?, currency: Currency, start: Instant): TransactionFlowsResponse {
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

    private fun calculateFlowsByType(
        vaultId: VaultId,
        transactionType: TransactionType,
        start: Instant,
        targetCurrency: Currency
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