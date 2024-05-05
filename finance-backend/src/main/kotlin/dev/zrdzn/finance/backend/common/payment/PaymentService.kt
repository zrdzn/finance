package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.payment.PaymentListResponse
import dev.zrdzn.finance.backend.api.payment.PaymentMethod
import dev.zrdzn.finance.backend.api.payment.PaymentResponse
import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
import java.time.Instant
import org.slf4j.LoggerFactory

class PaymentService(
    private val paymentRepository: PaymentRepository
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
                    description = description,
                    total = price.amount,
                    currency = price.currency
                )
            )
            .also { logger.info("Successfully created new payment: $it") }
            .let { PaymentCreateResponse(id = it.id!!) }

    fun getPaymentsByVaultId(vaultId: VaultId): PaymentListResponse =
        paymentRepository
            .findByVaultId(vaultId)
            .map {
                PaymentResponse(
                    id = it.id!!,
                    userId = it.userId,
                    vaultId = it.vaultId,
                    payedAt = it.payedAt.toString(),
                    paymentMethod = it.paymentMethod,
                    description = it.description,
                    total = it.total,
                    currency = it.currency
                )
            }
            .toSet()
            .let { PaymentListResponse(it)}

}