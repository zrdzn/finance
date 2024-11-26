package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.TransactionService
import dev.zrdzn.finance.backend.transaction.api.*
import dev.zrdzn.finance.backend.transaction.api.flow.TransactionFlowsResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleCreateRequest
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleListResponse
import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
    private val transactionService: TransactionService
) {

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
                vaultId = transactionCreateRequest.vaultId,
                transactionMethod = transactionCreateRequest.transactionMethod,
                transactionType = transactionCreateRequest.transactionType,
                description = transactionCreateRequest.description,
                price = Price(
                    amount = transactionCreateRequest.price,
                    currency = transactionCreateRequest.currency
                )
            )

    @PostMapping("/{transactionId}/products/create")
    fun createTransactionProduct(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int,
        @RequestBody transactionProductCreateRequest: TransactionProductCreateRequest
    ): TransactionProductResponse =
        transactionService.createTransactionProduct(
            requesterId = userId,
            transactionId = transactionId,
            productId = transactionProductCreateRequest.productId,
            unitAmount = transactionProductCreateRequest.unitAmount,
            quantity = transactionProductCreateRequest.quantity
        )

    @PostMapping("/{transactionId}/schedule/create")
    fun createSchedule(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int,
        @RequestBody scheduleCreateRequest: ScheduleCreateRequest
    ): ScheduleResponse =
        transactionService.createSchedule(
            requesterId = userId,
            transactionId = transactionId,
            description = scheduleCreateRequest.description,
            interval = scheduleCreateRequest.interval,
            amount = scheduleCreateRequest.amount
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

    @GetMapping("/{transactionId}/products")
    fun getTransactionProducts(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int
    ): TransactionProductListResponse =
        transactionService.getTransactionProducts(userId, transactionId)

    @GetMapping("/schedules/{vaultId}")
    fun getSchedulesByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): ScheduleListResponse = transactionService.getSchedules(userId, vaultId)

    @GetMapping("/{vaultId}/flows")
    fun getExpensesByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int,
        @RequestParam("transactionType", required = false) transactionType: TransactionType?,
        @RequestParam("currency") currency: String,
        @RequestParam("start") start: Instant
    ): TransactionFlowsResponse =
        transactionService.getTransactionFlows(
            requesterId = userId,
            vaultId = vaultId,
            transactionType = transactionType,
            currency = currency,
            start = start
        )

    @DeleteMapping("/{transactionId}")
    fun deleteTransaction(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int
    ): Unit = transactionService.deleteTransaction(transactionId)

    @DeleteMapping("/schedules/{scheduleId}")
    fun deleteScheduleById(
        @AuthenticationPrincipal userId: Int,
        @PathVariable scheduleId: Int
    ): Unit = transactionService.deleteSchedule(userId, scheduleId)

}