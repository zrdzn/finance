package dev.zrdzn.finance.backend.common.payment.infrastructure

import dev.zrdzn.finance.backend.api.payment.PaymentCreateRequest
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.common.payment.PaymentService
import dev.zrdzn.finance.backend.common.user.UserId
import org.springframework.security.core.annotation.AuthenticationPrincipal
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
                paymentMethod = paymentCreateRequest.paymentMethod,
                description = paymentCreateRequest.description,
                price = Price(
                    unitAmount = paymentCreateRequest.price,
                    currency = paymentCreateRequest.currency
                )
            )

}