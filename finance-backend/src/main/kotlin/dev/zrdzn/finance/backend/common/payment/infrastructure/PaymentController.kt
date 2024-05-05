package dev.zrdzn.finance.backend.common.payment.infrastructure

import dev.zrdzn.finance.backend.api.payment.PaymentCreateRequest
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.payment.PaymentListResponse
import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.common.payment.PaymentService
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
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

    @GetMapping("/{vaultId}")
    fun getPaymentsByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): PaymentListResponse =
        paymentService.getPaymentsByVaultId(vaultId)

}