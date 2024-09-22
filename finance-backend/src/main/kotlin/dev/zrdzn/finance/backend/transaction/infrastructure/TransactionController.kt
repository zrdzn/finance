package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.TransactionId
import dev.zrdzn.finance.backend.transaction.TransactionService
import dev.zrdzn.finance.backend.transaction.api.TransactionAmountResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionCreateRequest
import dev.zrdzn.finance.backend.transaction.api.TransactionCreateResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionListResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import dev.zrdzn.finance.backend.transaction.api.TransactionUpdateRequest
import dev.zrdzn.finance.backend.transaction.api.flow.TransactionFlowsResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductCreateResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductListResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
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
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
    private val transactionService: TransactionService
) {

    @GetMapping("/{vaultId}/export")
    fun exportTransactions(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId,
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
        @AuthenticationPrincipal userId: UserId,
        @RequestBody transactionCreateRequest: TransactionCreateRequest
    ): TransactionCreateResponse =
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
        @AuthenticationPrincipal userId: UserId,
        @PathVariable transactionId: TransactionId,
        @RequestBody transactionProductCreateRequest: TransactionProductCreateRequest
    ): TransactionProductCreateResponse =
        transactionService.createTransactionProduct(
            requesterId = userId,
            transactionId = transactionId,
            productId = transactionProductCreateRequest.productId,
            unitAmount = transactionProductCreateRequest.unitAmount,
            quantity = transactionProductCreateRequest.quantity
        )

    @PatchMapping("/{transactionId}")
    fun updateTransactions(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable transactionId: TransactionId,
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

    @DeleteMapping("/{transactionId}")
    fun deleteTransaction(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable transactionId: TransactionId
    ): Unit = transactionService.deleteTransaction(transactionId)

    @GetMapping("/{vaultId}")
    fun getTransactionsByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): TransactionListResponse =
        transactionService.getTransactions(userId, vaultId)

    @GetMapping("/{vaultId}/amount")
    fun getTransactionsAmountByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): TransactionAmountResponse = transactionService.getTransactionsAmount(userId, vaultId)

    @GetMapping("/{transactionId}/products")
    fun getTransactionProducts(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable transactionId: TransactionId
    ): TransactionProductListResponse =
        transactionService.getTransactionProducts(userId, transactionId)

    @GetMapping("/{vaultId}/flows")
    fun getExpensesByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId,
        @RequestParam("transactionType", required = false) transactionType: TransactionType?,
        @RequestParam("currency") currency: Currency,
        @RequestParam("start") start: Instant
    ): TransactionFlowsResponse =
        transactionService.getTransactionFlows(
            requesterId = userId,
            vaultId = vaultId,
            transactionType = transactionType,
            currency = currency,
            start = start
        )

}