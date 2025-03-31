package dev.zrdzn.finance.backend.transaction

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.opencsv.CSVWriter
import dev.zrdzn.finance.backend.ai.AiClient
import dev.zrdzn.finance.backend.ai.AiPrompts.ANALYZE_TRANSACTION_FROM_IMAGE
import dev.zrdzn.finance.backend.audit.AuditAction
import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.category.CategoryService
import dev.zrdzn.finance.backend.exchange.ExchangeService
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.TransactionMapper.toResponse
import dev.zrdzn.finance.backend.transaction.dto.AnalysedTransactionResponse
import dev.zrdzn.finance.backend.transaction.dto.FlowsChartResponse
import dev.zrdzn.finance.backend.transaction.dto.FlowsChartSeries
import dev.zrdzn.finance.backend.transaction.dto.TransactionAmountResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionFlowsResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionListResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionResponse
import dev.zrdzn.finance.backend.transaction.error.TransactionDescriptionInvalidError
import dev.zrdzn.finance.backend.transaction.error.TransactionNotFoundError
import dev.zrdzn.finance.backend.transaction.error.TransactionPriceNegativeError
import dev.zrdzn.finance.backend.transaction.error.TransactionProductNameInvalidError
import dev.zrdzn.finance.backend.transaction.error.TransactionProductNotFoundError
import dev.zrdzn.finance.backend.transaction.error.TransactionProductPriceNegativeError
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultPermission
import dev.zrdzn.finance.backend.vault.VaultService
import java.io.InputStream
import java.io.StringWriter
import java.math.BigDecimal
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.Month
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.util.Locale
import org.apache.commons.codec.binary.Base64
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val transactionProductRepository: TransactionProductRepository,
    private val transactionImportService: TransactionImportService,
    private val categoryService: CategoryService,
    private val exchangeService: ExchangeService,
    private val vaultService: VaultService,
    private val userService: UserService,
    private val auditService: AuditService,
    private val clock: Clock,
    private val aiClient: AiClient
) {

    companion object {
        const val MIN_DESCRIPTION_LENGTH = 3
        const val MAX_DESCRIPTION_LENGTH = 32

        const val PRODUCT_NAME_MIN_LENGTH = 1
        const val PRODUCT_NAME_MAX_LENGTH = 32
    }

    @Transactional
    fun analyzeImage(userId: Int, file: InputStream): AnalysedTransactionResponse {
        val imageBytes = file.readAllBytes()
        val base64Image = Base64.encodeBase64String(imageBytes)

        val response = aiClient.sendRequest(
            prompt = ANALYZE_TRANSACTION_FROM_IMAGE,
            base64Image = base64Image
        )

        val analysedTransaction = jacksonObjectMapper().readValue<AnalysedTransactionResponse>(response.response)

        return analysedTransaction
    }

    @Transactional
    fun importTransactionsFromCsv(
        requesterId: Int,
        vaultId: Int,
        separator: Char,
        fileData: InputStream,
        mappings: Map<String, String>,
        applyTransactionMethod: TransactionMethod?
    ) =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.TRANSACTION_CREATE) {
            val transactions = transactionImportService.importFromCsv(
                vaultId = vaultId,
                separator = separator,
                fileData = fileData,
                mappings = mappings,
                applyTransactionMethod = applyTransactionMethod
            )

            val now = Instant.now(clock)

            transactions.forEach {
                if (it.description.length !in MIN_DESCRIPTION_LENGTH..MAX_DESCRIPTION_LENGTH) throw TransactionDescriptionInvalidError()
                if (it.price < BigDecimal.ZERO) throw TransactionPriceNegativeError()

                transactionRepository.save(
                    Transaction(
                        id = null,
                        userId = requesterId,
                        vaultId = it.vaultId,
                        createdAt = now,
                        transactionMethod = it.transactionMethod,
                        transactionType = it.transactionType,
                        description = it.description,
                        total = it.price,
                        currency = it.currency
                    )
                )
            }

            auditService.createAudit(
                vaultId = vaultId,
                userId = requesterId,
                auditAction = AuditAction.TRANSACTION_IMPORTED,
                description = "Transactions amount ${transactions.size}"
            )
        }

    @Transactional
    fun exportTransactionsToCsv(requesterId: Int, vaultId: Int, startDate: Instant, endDate: Instant): String {
        val transactions = getTransactions(requesterId, vaultId, startDate, endDate).transactions

        val writer = StringWriter()
        val csvWriter = CSVWriter(writer)

        val headers = arrayOf(
            "User Email",
            "Vault Name",
            "Transaction Date",
            "Transaction Method",
            "Transaction Type",
            "Description",
            "Total",
            "Currency"
        )
        csvWriter.writeNext(headers, false)

        transactions.forEach {
            val data = arrayOf(
                it.user.email,
                vaultService.getVault(vaultId = vaultId, requesterId = requesterId).name,
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.of("UTC")).format(it.createdAt),
                it.transactionMethod.toString(),
                it.transactionType.toString(),
                it.description,
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
    fun createTransaction(
        requesterId: Int,
        userId: Int,
        vaultId: Int,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String,
        price: Price,
        products: Set<TransactionProductCreateRequest>
    ): TransactionResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.TRANSACTION_CREATE) {
            createTransactionForcefully(
                userId = userId,
                vaultId = vaultId,
                transactionMethod = transactionMethod,
                transactionType = transactionType,
                description = description,
                price = price,
                products = products
            )
        }

    @Transactional
    fun createTransactionForcefully(
        userId: Int,
        vaultId: Int,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String,
        price: Price,
        products: Set<TransactionProductCreateRequest>
    ): TransactionResponse {
        if (description.length !in MIN_DESCRIPTION_LENGTH..MAX_DESCRIPTION_LENGTH) throw TransactionDescriptionInvalidError()
        if (price.amount < BigDecimal.ZERO) throw TransactionPriceNegativeError()

        val transaction = transactionRepository.save(
            Transaction(
                id = null,
                userId = userId,
                vaultId = vaultId,
                createdAt = Instant.now(clock),
                transactionMethod = transactionMethod,
                transactionType = transactionType,
                description = description,
                total = price.amount.abs(),
                currency = price.currency
            )
        )

        products.forEach {
            createTransactionProductForcefully(
                userId = userId,
                transactionId = transaction.id!!,
                name = it.name,
                categoryId = it.categoryId,
                unitAmount = it.unitAmount,
                quantity = it.quantity
            )
        }

        auditService.createAudit(
            vaultId = vaultId,
            userId = userId,
            auditAction = AuditAction.TRANSACTION_CREATED,
            description = description
        )

        return transaction.toResponse(
            user = userService.getUser(userId),
            products = getTransactionProductsForcefully(transaction.id!!),
            totalInVaultCurrency = exchangeService.convertCurrency(transaction.total, transaction.currency, "PLN").amount
        )
    }

    @Transactional
    fun createTransactionProduct(
        requesterId: Int,
        userId: Int,
        transactionId: Int,
        name: String,
        categoryId: Int?,
        unitAmount: BigDecimal,
        quantity: Int
    ): TransactionProductResponse {
        val transaction = getTransaction(requesterId, transactionId)

        if (name.length !in PRODUCT_NAME_MIN_LENGTH..PRODUCT_NAME_MAX_LENGTH) throw TransactionProductNameInvalidError()
        if (unitAmount < BigDecimal.ZERO) throw TransactionProductPriceNegativeError()

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_CREATE) {
            createTransactionProductForcefully(
                userId = userId,
                transactionId = transactionId,
                name = name,
                categoryId = categoryId,
                unitAmount = unitAmount,
                quantity = quantity
            )
        }
    }

    @Transactional
    fun createTransactionProductForcefully(
        userId: Int,
        transactionId: Int,
        name: String,
        categoryId: Int?,
        unitAmount: BigDecimal,
        quantity: Int
    ): TransactionProductResponse {
        val transaction = getTransactionForcefully(transactionId)

        if (name.length !in PRODUCT_NAME_MIN_LENGTH..PRODUCT_NAME_MAX_LENGTH) throw TransactionProductNameInvalidError()
        if (unitAmount < BigDecimal.ZERO) throw TransactionProductPriceNegativeError()

        val transactionProduct = transactionProductRepository.save(
            TransactionProduct(
                id = null,
                transactionId = transactionId,
                name = name,
                categoryId = categoryId,
                unitAmount = unitAmount,
                quantity = quantity,
            )
        )

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = userId,
            auditAction = AuditAction.TRANSACTION_PRODUCT_CREATED,
            description = name
        )

        return transactionProduct.toResponse(categoryId?.let { categoryService.getCategoryForcefully(it) })
    }

    @Transactional
    fun updateTransaction(
        requesterId: Int,
        transactionId: Int,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String,
        price: Price
    ) {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundError()

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_UPDATE) {
            if (description.length !in MIN_DESCRIPTION_LENGTH..MAX_DESCRIPTION_LENGTH) throw TransactionDescriptionInvalidError()
            if (price.amount < BigDecimal.ZERO) throw TransactionPriceNegativeError()

            transaction.transactionMethod = transactionMethod
            transaction.transactionType = transactionType
            transaction.description = description
            transaction.total = price.amount
            transaction.currency = price.currency

            auditService.createAudit(
                vaultId = transaction.vaultId,
                userId = requesterId,
                auditAction = AuditAction.TRANSACTION_UPDATED,
                description = description
            )
        }
    }

    @Transactional
    fun updateTransactionProduct(
        requesterId: Int,
        transactionId: Int,
        productId: Int,
        name: String,
        categoryId: Int?,
        unitAmount: BigDecimal,
        quantity: Int
    ) {
        val transaction = getTransaction(requesterId, transactionId)

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_UPDATE) {
            val transactionProduct = transactionProductRepository.findById(productId) ?: throw TransactionProductNotFoundError()

            if (name.length !in PRODUCT_NAME_MIN_LENGTH..PRODUCT_NAME_MAX_LENGTH) throw TransactionProductNameInvalidError()
            if (unitAmount < BigDecimal.ZERO) throw TransactionProductPriceNegativeError()
            if (quantity < 0) throw TransactionProductPriceNegativeError()

            transactionProduct.name = name
            transactionProduct.categoryId = categoryId
            transactionProduct.unitAmount = unitAmount
            transactionProduct.quantity = quantity

            auditService.createAudit(
                vaultId = transaction.vaultId,
                userId = requesterId,
                auditAction = AuditAction.TRANSACTION_PRODUCT_UPDATED,
                description = name
            )
        }
    }

    @Transactional
    fun deleteTransaction(requesterId: Int, transactionId: Int) {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundError()

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_DELETE) {
            transactionRepository.deleteById(transactionId)

            auditService.createAudit(
                vaultId = transaction.vaultId,
                userId = requesterId,
                auditAction = AuditAction.TRANSACTION_DELETED,
                description = transaction.description
            )
        }
    }

    @Transactional
    fun deleteTransactionProduct(requesterId: Int, transactionProductId: Int) {
        val transactionProduct = transactionProductRepository.findById(transactionProductId) ?: throw TransactionProductNotFoundError()
        val transaction = getTransaction(requesterId, transactionProduct.transactionId)

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_UPDATE) {
            transactionProductRepository.deleteById(transactionProductId)

            auditService.createAudit(
                vaultId = transaction.vaultId,
                userId = requesterId,
                auditAction = AuditAction.TRANSACTION_PRODUCT_DELETED,
                description = transactionProduct.name
            )
        }
    }

    @Transactional(readOnly = true)
    fun getTransactions(requesterId: Int, vaultId: Int): TransactionListResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.TRANSACTION_READ) { _ ->
            transactionRepository
                .findByVaultId(vaultId)
                .map {
                    it.toResponse(
                        user = userService.getUser(it.userId),
                        products = getTransactionProducts(requesterId, it.id!!),
                        totalInVaultCurrency = exchangeService.convertCurrency(it.total, it.currency, "PLN").amount
                    )
                }
                .toSet()
                .let { TransactionListResponse(it) }
        }

    @Transactional(readOnly = true)
    fun getTransactions(requesterId: Int, vaultId: Int, startDate: Instant, endDate: Instant): TransactionListResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.TRANSACTION_READ) {
            transactionRepository
                .findByVaultIdAndCreatedAtBetween(vaultId, startDate, endDate)
                .map {
                    it.toResponse(
                        user = userService.getUser(it.userId),
                        products = getTransactionProducts(requesterId, it.id!!),
                        totalInVaultCurrency = exchangeService.convertCurrency(it.total, it.currency, "PLN").amount
                    )
                }
                .toSet()
                .let { TransactionListResponse(it) }
        }

    @Transactional(readOnly = true)
    fun getTransaction(requesterId: Int, transactionId: Int): TransactionResponse {
        val transaction = getTransactionForcefully(transactionId)

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_READ) {
            transaction
        }
    }

    @Transactional(readOnly = true)
    fun getTransactionForcefully(transactionId: Int): TransactionResponse =
        transactionRepository.findById(transactionId)
            ?.let {
                it.toResponse(
                    user = userService.getUser(it.userId),
                    products = getTransactionProductsForcefully(it.id!!),
                    totalInVaultCurrency = exchangeService.convertCurrency(it.total, it.currency, "PLN").amount
                )
            }
            ?: throw TransactionNotFoundError()

    @Transactional(readOnly = true)
    fun getTransactionsAmount(requesterId: Int, vaultId: Int): TransactionAmountResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.TRANSACTION_READ) {
            transactionRepository
                .countByVaultId(vaultId)
                .let { TransactionAmountResponse(it.toInt()) }
        }

    @Transactional(readOnly = true)
    fun getTransactionProducts(requesterId: Int, transactionId: Int): TransactionProductListResponse {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundError()

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_READ) {
            getTransactionProductsForcefully(transactionId)
        }
    }

    @Transactional(readOnly = true)
    fun getTransactionProductsForcefully(transactionId: Int): TransactionProductListResponse =
        transactionProductRepository
            .findByTransactionId(transactionId)
            .map { it.toResponse(it.categoryId?.let { id -> categoryService.getCategoryForcefully(id) }) }
            .toSet()
            .let { TransactionProductListResponse(it) }

    @Transactional(readOnly = true)
    fun getFlows(requesterId: Int, vaultId: Int, transactionType: TransactionType?, start: Instant): TransactionFlowsResponse {
        val vault = vaultService.getVault(vaultId, requesterId)

        // if transaction type is not provided, calculate balance
        if (transactionType == null) {
            val income = calculateFlowsByType(vaultId, TransactionType.INCOMING, start, vault.currency)
            val outcome = calculateFlowsByType(vaultId, TransactionType.OUTGOING, start, vault.currency)

            return TransactionFlowsResponse(
                total = Price(
                    amount = income - outcome,
                    currency = vault.currency
                ),
                count = transactionRepository
                    .countByVaultId(vaultId)
                    .let { TransactionAmountResponse(it.toInt()) }
            )
        }

        return TransactionFlowsResponse(
            total = Price(
                amount = calculateFlowsByType(vaultId, transactionType, start, vault.currency),
                currency = vault.currency
            ),
            count = transactionRepository
                .countByVaultIdAndTransactionType(vaultId, transactionType, start)
                .let { TransactionAmountResponse(it.toInt()) }
        )
    }

    @Transactional(readOnly = true)
    fun getFlowsChart(
        requesterId: Int,
        vaultId: Int,
        transactionType: TransactionType?
    ): FlowsChartResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.TRANSACTION_READ) {
            val results = transactionRepository.getMonthlyTransactionSums(vaultId)

            val today = LocalDate.now(clock)

            val monthsData = mutableMapOf<String, Triple<BigDecimal, BigDecimal, BigDecimal>>()

            val categories = mutableListOf<String>()
            for (monthIndex in 11 downTo 0) {
                val monthDate = today.minusMonths(monthIndex.toLong())
                val monthDisplayName = "${monthDate.month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH)} ${monthDate.year}"

                categories.add(monthDisplayName)
                monthsData[monthDisplayName] = Triple(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO)
            }

            results.forEach {
                val month = it[0] as Int
                val year = it[1] as Int
                val incoming = it[2] as BigDecimal
                val outgoing = it[3] as BigDecimal

                val key = "${Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH)} $year"
                if (key in monthsData) {
                    monthsData[key] = Triple(incoming, outgoing, incoming.minus(outgoing))
                }
            }

            val incomingData = categories.map { monthsData[it]?.first ?: BigDecimal.ZERO }
            val outgoingData = categories.map { monthsData[it]?.second ?: BigDecimal.ZERO }
            val differenceData = categories.map { monthsData[it]?.third ?: BigDecimal.ZERO }

            when (transactionType) {
                TransactionType.INCOMING -> FlowsChartResponse(categories, listOf(FlowsChartSeries("Income", incomingData)))
                TransactionType.OUTGOING -> FlowsChartResponse(categories, listOf(FlowsChartSeries("Spent", outgoingData)))
                else -> FlowsChartResponse(categories, listOf(FlowsChartSeries("Balance", differenceData)))
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
