package dev.zrdzn.finance.backend.transaction.application

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.opencsv.CSVParserBuilder
import com.opencsv.CSVReaderBuilder
import com.opencsv.CSVWriter
import com.opencsv.enums.CSVReaderNullFieldIndicator
import dev.zrdzn.finance.backend.ai.domain.AiClient
import dev.zrdzn.finance.backend.ai.domain.AiPrompts.ANALYZE_TRANSACTION_FROM_IMAGE
import dev.zrdzn.finance.backend.audit.application.AuditService
import dev.zrdzn.finance.backend.audit.domain.AuditAction
import dev.zrdzn.finance.backend.category.application.CategoryService
import dev.zrdzn.finance.backend.exchange.application.ExchangeService
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.application.TransactionMapper.toResponse
import dev.zrdzn.finance.backend.transaction.application.error.ScheduleNotFoundError
import dev.zrdzn.finance.backend.transaction.application.error.TransactionDescriptionRequiredError
import dev.zrdzn.finance.backend.transaction.application.error.TransactionImportMappingNotFoundError
import dev.zrdzn.finance.backend.transaction.application.error.TransactionNotFoundError
import dev.zrdzn.finance.backend.transaction.application.error.TransactionPriceRequiredError
import dev.zrdzn.finance.backend.transaction.application.error.TransactionProductNotFoundError
import dev.zrdzn.finance.backend.transaction.application.request.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.transaction.application.response.AnalysedTransactionResponse
import dev.zrdzn.finance.backend.transaction.application.response.FlowsChartResponse
import dev.zrdzn.finance.backend.transaction.application.response.FlowsChartSeries
import dev.zrdzn.finance.backend.transaction.application.response.ScheduleListResponse
import dev.zrdzn.finance.backend.transaction.application.response.ScheduleResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionAmountResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionFlowsResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionListResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionResponse
import dev.zrdzn.finance.backend.transaction.domain.Schedule
import dev.zrdzn.finance.backend.transaction.domain.ScheduleInterval
import dev.zrdzn.finance.backend.transaction.domain.ScheduleRepository
import dev.zrdzn.finance.backend.transaction.domain.Transaction
import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod
import dev.zrdzn.finance.backend.transaction.domain.TransactionProduct
import dev.zrdzn.finance.backend.transaction.domain.TransactionProductRepository
import dev.zrdzn.finance.backend.transaction.domain.TransactionRepository
import dev.zrdzn.finance.backend.transaction.domain.TransactionType
import dev.zrdzn.finance.backend.user.application.UserService
import dev.zrdzn.finance.backend.vault.application.VaultPermission
import dev.zrdzn.finance.backend.vault.application.VaultService
import java.io.InputStream
import java.io.InputStreamReader
import java.io.StringWriter
import java.math.BigDecimal
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.Month
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.Locale
import org.apache.commons.codec.binary.Base64
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val transactionProductRepository: TransactionProductRepository,
    private val scheduleRepository: ScheduleRepository,
    private val categoryService: CategoryService,
    private val exchangeService: ExchangeService,
    private val vaultService: VaultService,
    private val userService: UserService,
    private val auditService: AuditService,
    private val clock: Clock,
    private val aiClient: AiClient
) {

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
        file: InputStream,
        mappings: Map<String, String>,
        applyTransactionMethod: TransactionMethod?
    ) {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_CREATE)

        val reader = InputStreamReader(file)

        val csvParser = CSVParserBuilder()
            .withSeparator(separator)
            .withQuoteChar('"')
            .withEscapeChar('\\')
            .withStrictQuotes(false)
            .withIgnoreLeadingWhiteSpace(true)
            .withIgnoreQuotations(false)
            .withFieldAsNull(CSVReaderNullFieldIndicator.NEITHER)
            .withErrorLocale(Locale.getDefault())
            .build()

        val csvReader = CSVReaderBuilder(reader)
            .withCSVParser(csvParser)
            .build()

        val csvRecords = csvReader.readAll()
        if (csvRecords.isEmpty()) {
            return
        }

        val header = csvRecords.first()
        val columns = mappings.mapValues { (_, columnName) ->
            header.indexOf(columnName).takeIf { it >= 0 } ?: throw IllegalArgumentException("Column $columnName not found in CSV header")
        }

        val transactions = mutableSetOf<Transaction>()

        for (csvRecord in csvRecords.drop(1)) {
            val values = try {
                mapOf(
                    "createdAt" to csvRecord.getOrNull(columns["createdAt"] ?: -1),
                    "transactionMethod" to csvRecord.getOrNull(columns["transactionMethod"] ?: -1),
                    "description" to csvRecord.getOrNull(columns["description"] ?: -1),
                    "total" to csvRecord.getOrNull(columns["total"] ?: -1),
                    "currency" to csvRecord.getOrNull(columns["currency"] ?: -1),
                    "rawPrice" to csvRecord.getOrNull(columns["rawPrice"] ?: -1)
                )
            } catch (e: NoSuchElementException) {
                throw TransactionImportMappingNotFoundError()
            }

            val transactionMethod = applyTransactionMethod ?: values["transactionMethod"]
                ?.let { TransactionMethod.valueOf(it) }
                ?: throw TransactionImportMappingNotFoundError()
            val description = values["description"] ?: throw TransactionImportMappingNotFoundError()
            val totalString = values["total"]
            val currency = values["currency"]
            val rawPrice = values["rawPrice"]

            val (total, finalCurrency) = when {
                !rawPrice.isNullOrBlank() -> {
                    val (parsedTotal, parsedCurrency) = parseRawPrice(rawPrice)
                    parsedTotal to (currency ?: parsedCurrency)
                }
                !totalString.isNullOrBlank() -> {
                    totalString.replace(" ", "").replace(",", ".").toBigDecimal() to (currency ?: throw TransactionImportMappingNotFoundError())
                }
                else -> throw TransactionPriceRequiredError()
            }

            val transactionType = when {
                total > BigDecimal.ZERO -> TransactionType.INCOMING
                total < BigDecimal.ZERO -> TransactionType.OUTGOING
                else -> throw TransactionPriceRequiredError()
            }

            transactions.add(
                Transaction(
                    id = null,
                    userId = requesterId,
                    vaultId = vaultId,
                    createdAt = Instant.now(clock),
                    transactionMethod = transactionMethod,
                    transactionType = transactionType,
                    description = description,
                    total = total,
                    currency = finalCurrency
                )
            )
        }

        transactions.forEach {
            transactionRepository.save(it)
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

        val headers = arrayOf("Payer Email", "Vault Name", "Transaction Date", "Transaction Method", "Transaction Type", "Description", "Total", "Currency")
        csvWriter.writeNext(headers, false)

        transactions.forEach {
            val data = arrayOf(
                it.user.email,
                vaultService.getVault(vaultId = vaultId, requesterId = requesterId).name,
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(it.createdAt),
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
    fun executeSchedules() {
        val now = Instant.now(clock)

        scheduleRepository.findByNextExecutionBefore(now).forEach { schedule ->
            val transaction = transactionRepository.findById(schedule.transactionId) ?: throw TransactionNotFoundError()

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
                        name = it.name,
                        categoryId = it.categoryId,
                        unitAmount = it.unitAmount,
                        quantity = it.quantity
                    )
                )
            }

            schedule.nextExecution = calculateNextExecutionDate(schedule.scheduleInterval, schedule.intervalValue)
        }
    }

    @Transactional
    fun createTransaction(
        requesterId: Int,
        vaultId: Int,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String,
        price: Price,
        products: Set<TransactionProductCreateRequest>
    ): TransactionResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_CREATE)

        if (description.isEmpty()) {
            throw TransactionDescriptionRequiredError()
        }

        val transaction = transactionRepository.save(
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

        products.forEach {
            createTransactionProduct(
                requesterId = requesterId,
                transactionId = transaction.id!!,
                name = it.name,
                categoryId = it.categoryId,
                unitAmount = it.unitAmount,
                quantity = it.quantity
            )
        }

        auditService.createAudit(
            vaultId = vaultId,
            userId = requesterId,
            auditAction = AuditAction.TRANSACTION_CREATED,
            description = description
        )

        return transaction.toResponse(
            user = userService.getUser(requesterId),
            products = getTransactionProducts(requesterId, transaction.id!!),
            totalInVaultCurrency = exchangeService.convertCurrency(transaction.total, transaction.currency, "PLN").amount
        )
    }

    @Transactional
    fun createTransactionProduct(
        requesterId: Int,
        transactionId: Int,
        name: String,
        categoryId: Int?,
        unitAmount: BigDecimal,
        quantity: Int
    ): TransactionProductResponse {
        val transaction = getTransaction(requesterId, transactionId)

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_CREATE)

        val categoryName = categoryId?.let { categoryService.getCategoryById(requesterId, it).name }

        return transactionProductRepository
            .save(
                TransactionProduct(
                    id = null,
                    transactionId = transactionId,
                    name = name,
                    categoryId = categoryId,
                    unitAmount = unitAmount,
                    quantity = quantity,
                )
            )
            .also {
                auditService.createAudit(
                    vaultId = transaction.vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.TRANSACTION_PRODUCT_CREATED,
                    description = name
                )
            }
            .toResponse(categoryName)
    }

    @Transactional
    fun createSchedule(requesterId: Int, transactionId: Int, description: String, interval: ScheduleInterval, amount: Int): ScheduleResponse {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundError()

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
    fun updateTransaction(
        requesterId: Int,
        transactionId: Int,
        transactionMethod: TransactionMethod,
        transactionType: TransactionType,
        description: String?,
        price: Price
    ) {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundError()

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
    fun deleteTransaction(transactionId: Int) {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundError()

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
    fun getTransactions(requesterId: Int, vaultId: Int): TransactionListResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
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
    fun getTransactions(requesterId: Int, vaultId: Int, startDate: Instant, endDate: Instant): TransactionListResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
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
        val transaction = transactionRepository.findById(transactionId)
            ?.let {
                it.toResponse(
                    user = userService.getUser(it.userId),
                    products = getTransactionProducts(requesterId, it.id!!),
                    totalInVaultCurrency = exchangeService.convertCurrency(it.total, it.currency, "PLN").amount
                )
            }
            ?: throw TransactionNotFoundError()

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transaction
    }

    @Transactional(readOnly = true)
    fun getTransactionsAmount(requesterId: Int, vaultId: Int): TransactionAmountResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionRepository
            .countByVaultId(vaultId)
            .let { TransactionAmountResponse(it.toInt()) }
    }

    @Transactional(readOnly = true)
    fun getTransactionProducts(requesterId: Int, transactionId: Int): TransactionProductListResponse {
        val transaction = transactionRepository.findById(transactionId) ?: throw TransactionNotFoundError()

        vaultService.authorizeMember(transaction.vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        return transactionProductRepository
            .findByTransactionId(transactionId)
            .map {
                val categoryName = it.categoryId?.let { id -> categoryService.getCategoryById(requesterId, id).name }

                it.toResponse(categoryName)
            }
            .toSet()
            .let { TransactionProductListResponse(it) }
    }

    @Transactional(readOnly = true)
    fun getTransactionProductForcefully(name: String): TransactionProductResponse {
        val product = transactionProductRepository.findByName(name) ?: throw TransactionProductNotFoundError()

        val categoryName = product.categoryId?.let { categoryService.getCategoryById(product.transactionId, it).name }

        return TransactionProductResponse(
            id = product.id!!,
            transactionId = product.transactionId,
            name = product.name,
            categoryName = categoryName,
            unitAmount = product.unitAmount,
            quantity = product.quantity
        )
    }

    @Transactional(readOnly = true)
    fun getSchedules(requesterId: Int, vaultId: Int): ScheduleListResponse {
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
    fun getScheduleForcefully(scheduleId: Int): ScheduleResponse =
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
            ?: throw ScheduleNotFoundError()

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
    ): FlowsChartResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.TRANSACTION_READ)

        val results = transactionRepository.getMonthlyTransactionSums(vaultId)

        val today = LocalDate.now(clock)
        val currentYear = today.year
        val currentMonth = today.monthValue

        val categories = Array(12) { index ->
            val month = (currentMonth - index - 1).mod(12) + 1
            val year = currentYear - if (month > currentMonth) 1 else 0
            "${Month.of(month).name.substring(0, 3)} ${year}'"
        }
        val incomingData = Array(12) { BigDecimal.ZERO }
        val outgoingData = Array(12) { BigDecimal.ZERO }
        val differenceData = Array(12) { BigDecimal.ZERO }

        results.forEach { row ->
            val month = row[0] as Int
            val incoming = row[1] as BigDecimal
            val outgoing = row[2] as BigDecimal

            categories[month - 1] = Month.of(month).name
            incomingData[month - 1] = incoming
            outgoingData[month - 1] = outgoing
            differenceData[month - 1] = incoming.minus(outgoing)
        }

        when (transactionType) {
            TransactionType.INCOMING -> return FlowsChartResponse(categories.reversed(), listOf(FlowsChartSeries("Income", incomingData.reversed())))
            TransactionType.OUTGOING -> return FlowsChartResponse(categories.reversed(), listOf(FlowsChartSeries("Spent", outgoingData.reversed())))
            else -> return FlowsChartResponse(categories.reversed(), listOf(FlowsChartSeries("Balance", differenceData.reversed())))
        }
    }

    @Transactional
    fun deleteSchedule(requesterId: Int, scheduleId: Int) {
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

    private fun parseRawPrice(rawPrice: String): Pair<BigDecimal, String> {
        val rawPriceCleaned = rawPrice.replace(" ", "").replace(",", ".")

        val regex = Regex("""^([A-Za-z]{3})?(-?\d{1,3}(?:\d{3})*(?:[.,]\d+)?)([A-Za-z]{3})?$""")

        val matchResult = regex.find(rawPriceCleaned) ?: throw IllegalArgumentException("Invalid rawPrice format")

        val groups = matchResult.groups
        val amount = groups[2]?.value
        val currency = (groups[1]?.value ?: "") + (groups[3]?.value ?: "")

        if (currency.isEmpty() || amount == null) {
            throw IllegalArgumentException("Invalid rawPrice format: missing currency or amount")
        }

        return BigDecimal(amount) to currency.trim().uppercase()
    }

}
