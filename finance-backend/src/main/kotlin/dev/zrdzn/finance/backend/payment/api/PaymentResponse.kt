package dev.zrdzn.finance.backend.payment.api

import dev.zrdzn.finance.backend.payment.PaymentId
import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import java.math.BigDecimal

data class PaymentResponse(
    val id: PaymentId,
    val userId: UserId,
    val vaultId: VaultId,
    val payedAt: String,
    val paymentMethod: PaymentMethod,
    val description: String?,
    val totalInVaultCurrency: BigDecimal,
    val total: BigDecimal,
    val currency: Currency
)
