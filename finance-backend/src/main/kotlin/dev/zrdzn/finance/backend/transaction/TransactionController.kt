package dev.zrdzn.finance.backend.transaction

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.dto.AnalysedTransactionResponse
import dev.zrdzn.finance.backend.transaction.dto.FlowsChartResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionAmountResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionCreateRequest
import dev.zrdzn.finance.backend.transaction.dto.TransactionFlowsResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionListResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductUpdateRequest
import dev.zrdzn.finance.backend.transaction.dto.TransactionResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionUpdateRequest
import java.time.Instant
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/v1/transactions")
class TransactionController(
    private val transactionService: TransactionService
) {

    @PostMapping("/image-analysis")
    fun analyzeImage(
        @AuthenticationPrincipal userId: Int,
        @RequestPart("file") file: MultipartFile
    ): AnalysedTransactionResponse = transactionService.analyzeImage(userId, file.inputStream)

    @PostMapping("/{vaultId}/import/csv")
    fun importTransactionsFromCsv(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int,
        @RequestParam("file") file: MultipartFile,
        @RequestParam("mappings") mappings: String,
        @RequestParam("separator") separator: String,
        @RequestParam("applyTransactionMethod", required = false) applyTransactionMethod: TransactionMethod?
    ) {
        val objectMapper = jacksonObjectMapper()
        val newMappings = objectMapper.readValue(mappings, object : TypeReference<Map<String, String>>() {})

        val mappingsMap = mutableMapOf<String, String>()
        for ((key, value) in newMappings) {
            mappingsMap[key] = value
        }

        transactionService.importTransactionsFromCsv(
            requesterId = userId,
            vaultId = vaultId,
            separator = separator[0],
            fileData = file.inputStream,
            mappings = mappingsMap,
            applyTransactionMethod = applyTransactionMethod
        )
    }

    @GetMapping("/{vaultId}/export")
    fun exportTransactions(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int,
        @RequestParam("startDate") startDate: Instant,
        @RequestParam("endDate") endDate: Instant
    ): ResponseEntity<String> {
        val content = transactionService.exportTransactionsToCsv(
            requesterId = userId,
            vaultId = vaultId,
            startDate = startDate,
            endDate = endDate
        )

        val headers = HttpHeaders()
        headers.add("Content-Disposition", "attachment; filename=transactions.csv")

        return ResponseEntity.ok()
            .headers(headers)
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(content)
    }

    @PostMapping("/create")
    fun createTransaction(
        @AuthenticationPrincipal userId: Int,
        @RequestBody transactionCreateRequest: TransactionCreateRequest
    ): TransactionResponse =
        transactionService
            .createTransaction(
                requesterId = userId,
                userId = userId,
                vaultId = transactionCreateRequest.vaultId,
                transactionMethod = transactionCreateRequest.transactionMethod,
                transactionType = transactionCreateRequest.transactionType,
                description = transactionCreateRequest.description,
                price = Price(
                    amount = transactionCreateRequest.price,
                    currency = transactionCreateRequest.currency
                ),
                products = transactionCreateRequest.products
            )

    @PostMapping("/{transactionId}/products/create")
    fun createTransactionProduct(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int,
        @RequestBody transactionProductCreateRequest: TransactionProductCreateRequest
    ): TransactionProductResponse =
        transactionService.createTransactionProduct(
            requesterId = userId,
            userId = userId,
            transactionId = transactionId,
            name = transactionProductCreateRequest.name,
            categoryId = transactionProductCreateRequest.categoryId,
            unitAmount = transactionProductCreateRequest.unitAmount,
            quantity = transactionProductCreateRequest.quantity
        )

    @PatchMapping("/{transactionId}")
    fun updateTransaction(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int,
        @RequestBody transactionUpdateRequest: TransactionUpdateRequest
    ): Unit =
        transactionService.updateTransaction(
            requesterId = userId,
            transactionId = transactionId,
            transactionMethod = transactionUpdateRequest.transactionMethod,
            transactionType = transactionUpdateRequest.transactionType,
            description = transactionUpdateRequest.description,
            price = Price(
                amount = transactionUpdateRequest.total,
                currency = transactionUpdateRequest.currency
            )
        )

    @PatchMapping("/{transactionId}/products/{productId}")
    fun updateTransactionProduct(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int,
        @PathVariable productId: Int,
        @RequestBody transactionProductUpdateRequest: TransactionProductUpdateRequest
    ): Unit =
        transactionService.updateTransactionProduct(
            requesterId = userId,
            transactionId = transactionId,
            productId = productId,
            name = transactionProductUpdateRequest.name,
            categoryId = transactionProductUpdateRequest.categoryId,
            unitAmount = transactionProductUpdateRequest.unitAmount,
            quantity = transactionProductUpdateRequest.quantity
        )

    @GetMapping("/{vaultId}")
    fun getTransactionsByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): TransactionListResponse =
        transactionService.getTransactions(userId, vaultId)

    @GetMapping("/{vaultId}/amount")
    fun getTransactionsAmountByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): TransactionAmountResponse = transactionService.getTransactionsAmount(userId, vaultId)

    @GetMapping("/{vaultId}/flows")
    fun getFlowsByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int,
        @RequestParam("transactionType", required = false) transactionType: TransactionType?,
        @RequestParam("start") start: Instant
    ): TransactionFlowsResponse =
        transactionService.getFlows(
            requesterId = userId,
            vaultId = vaultId,
            transactionType = transactionType,
            start = start
        )

    @GetMapping("/{vaultId}/flows/chart")
    fun getFlowsChart(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int,
        @RequestParam("transactionType", required = false) transactionType: TransactionType?
    ): FlowsChartResponse =
        transactionService.getFlowsChart(
            requesterId = userId,
            vaultId = vaultId,
            transactionType = transactionType
        )

    @DeleteMapping("/{transactionId}")
    fun deleteTransaction(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int
    ): Unit = transactionService.deleteTransaction(userId, transactionId)

    @DeleteMapping("/{transactionId}/products/{productId}")
    fun deleteTransactionProduct(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int,
        @PathVariable productId: Int
    ): Unit = transactionService.deleteTransactionProduct(userId, productId)

}