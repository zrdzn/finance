package dev.zrdzn.finance.backend.payment.infrastructure

import dev.zrdzn.finance.backend.payment.PaymentId
import dev.zrdzn.finance.backend.payment.PaymentService
import dev.zrdzn.finance.backend.payment.api.PaymentCreateRequest
import dev.zrdzn.finance.backend.payment.api.PaymentCreateResponse
import dev.zrdzn.finance.backend.payment.api.PaymentListResponse
import dev.zrdzn.finance.backend.payment.api.PaymentUpdateRequest
import dev.zrdzn.finance.backend.payment.api.expense.PaymentAverageExpensesResponse
import dev.zrdzn.finance.backend.payment.api.expense.PaymentExpenseRange
import dev.zrdzn.finance.backend.payment.api.expense.PaymentExpensesResponse
import dev.zrdzn.finance.backend.payment.api.product.PaymentProductCreateRequest
import dev.zrdzn.finance.backend.payment.api.product.PaymentProductCreateResponse
import dev.zrdzn.finance.backend.payment.api.product.PaymentProductListResponse
import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import java.time.Instant
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
@RequestMapping("/api/payment")
class PaymentController(
    private val paymentService: PaymentService
) {

    @PostMapping("/create")
    fun createPayment(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody paymentCreateRequest: PaymentCreateRequest
    ): PaymentCreateResponse =
        paymentService
            .createPayment(
                userId = userId,
                vaultId = paymentCreateRequest.vaultId,
                paymentMethod = paymentCreateRequest.paymentMethod,
                description = paymentCreateRequest.description,
                price = Price(
                    amount = paymentCreateRequest.price,
                    currency = paymentCreateRequest.currency
                )
            )

    @PostMapping("/{paymentId}/products/create")
    fun createPaymentProduct(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable paymentId: PaymentId,
        @RequestBody paymentProductCreateRequest: PaymentProductCreateRequest
    ): PaymentProductCreateResponse =
        paymentService.createPaymentProduct(
            paymentId = paymentId,
            productId = paymentProductCreateRequest.productId,
            unitAmount = paymentProductCreateRequest.unitAmount,
            quantity = paymentProductCreateRequest.quantity
        )

    @PatchMapping("/{paymentId}")
    fun updatePayment(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable paymentId: PaymentId,
        @RequestBody paymentUpdateRequest: PaymentUpdateRequest
    ): Unit =
        paymentService.updatePayment(
            paymentId = paymentId,
            paymentMethod = paymentUpdateRequest.paymentMethod,
            description = paymentUpdateRequest.description,
            price = Price(
                amount = paymentUpdateRequest.total,
                currency = paymentUpdateRequest.currency
            )
        )

    @DeleteMapping("/{paymentId}")
    fun deletePayment(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable paymentId: PaymentId
    ): Unit = paymentService.deletePayment(paymentId)

    @GetMapping("/{vaultId}")
    fun getPaymentsByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): PaymentListResponse =
        paymentService.getPaymentsByVaultId(vaultId)

    @GetMapping("/{paymentId}/products")
    fun getPaymentProducts(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable paymentId: PaymentId
    ): PaymentProductListResponse =
        paymentService.getPaymentProducts(paymentId)

    @GetMapping("/{vaultId}/expenses")
    fun getExpensesByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId,
        @RequestParam("currency") currency: Currency,
        @RequestParam("start") start: Instant
    ): PaymentExpensesResponse =
        paymentService.getPaymentExpenses(
            vaultId = vaultId,
            currency = currency,
            start = start
        )

    @GetMapping("/{vaultId}/expenses/average")
    fun getAverageExpensesByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId,
        @RequestParam("currency") currency: Currency,
        @RequestParam("range") range: PaymentExpenseRange
    ): PaymentAverageExpensesResponse =
        paymentService.getPaymentAverageExpenses(
            vaultId = vaultId,
            currency = currency,
            range = range
        )

}