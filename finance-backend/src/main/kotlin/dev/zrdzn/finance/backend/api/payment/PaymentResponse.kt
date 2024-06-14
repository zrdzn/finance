package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.api.shared.Currency
import dev.zrdzn.finance.backend.common.payment.PaymentId
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
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
