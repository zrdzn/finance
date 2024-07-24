package dev.zrdzn.finance.backend.payment.api

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.vault.VaultId
import java.math.BigDecimal

data class PaymentCreateRequest(
    val vaultId: VaultId,
    val paymentMethod: PaymentMethod,
    val description: String?,
    val price: BigDecimal,
    val currency: Currency
)
