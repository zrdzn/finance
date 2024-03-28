package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.PaymentCreateRequest
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import java.time.Instant

class PaymentFacade(private val paymentRepository: PaymentRepository) {

    fun createPayment(paymentCreateRequest: PaymentCreateRequest): PaymentCreateResponse =
        paymentRepository
            .save(
                Payment(
                    id = null,
                    userId = paymentCreateRequest.userId,
                    payedAt = Instant.now(),
                    paymentMethod = paymentCreateRequest.paymentMethod,
                    description = paymentCreateRequest.description
                )
            )
            .let { PaymentCreateResponse(id = it.id!!) }

}