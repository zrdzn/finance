package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.payment.PaymentMethod
import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
import java.time.Instant
import org.slf4j.LoggerFactory

class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val paymentPriceRepository: PaymentPriceRepository
) {

    private val logger = LoggerFactory.getLogger(PaymentService::class.java)

    fun createPayment(
        userId: UserId,
        vaultId: VaultId,
        paymentMethod: PaymentMethod,
        description: String?,
        price: Price
    ): PaymentCreateResponse =
        paymentRepository
            .save(
                Payment(
                    id = null,
                    userId = userId,
                    vaultId = vaultId,
                    payedAt = Instant.now(),
                    paymentMethod = paymentMethod,
                    description = description
                )
            )
            .also {
                createPaymentPrice(
                    paymentId = it.id!!,
                    price = price
                )
            }
            .also { logger.info("Successfully created new payment: $it") }
            .let { PaymentCreateResponse(id = it.id!!) }

    fun createPaymentPrice(paymentId: PaymentId, price: Price) =
        paymentPriceRepository
            .save(
                PaymentPrice(
                    id = null,
                    paymentId = paymentId,
                    unitAmount = price.unitAmount,
                    priceCurrency = price.currency
                )
            )

}