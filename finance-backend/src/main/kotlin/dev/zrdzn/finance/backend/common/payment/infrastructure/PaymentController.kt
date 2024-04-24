package dev.zrdzn.finance.backend.common.payment.infrastructure

import dev.zrdzn.finance.backend.api.payment.PaymentCreateRequest
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.common.payment.PaymentService
import org.springframework.http.ResponseEntity
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
        @RequestBody paymentCreateRequest: PaymentCreateRequest
    ): ResponseEntity<PaymentCreateResponse> =
        paymentService
            .createPayment(paymentCreateRequest)
            .let { ResponseEntity.ok(it) }

}