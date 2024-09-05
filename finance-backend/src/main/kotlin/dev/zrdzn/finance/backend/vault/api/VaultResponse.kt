package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.payment.api.PaymentMethod
import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultPublicId
import java.time.Instant

data class VaultResponse(
    val id: VaultId,
    val createdAt: Instant,
    val publicId: VaultPublicId,
    val ownerId: UserId,
    val name: String,
    val currency: Currency,
    val paymentMethod: PaymentMethod
)
