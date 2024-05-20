package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.common.vault.VaultId
import java.time.Instant

interface PaymentRepository {

    fun save(payment: Payment): Payment

    fun findByVaultId(vaultId: VaultId): Set<Payment>

    fun sumAndGroupExpensesByVaultId(vaultId: VaultId): List<Price>

    fun sumAndGroupExpensesByVaultId(vaultId: VaultId, start: Instant): List<Price>

    fun countTotalDaysByVaultId(vaultId: VaultId): Long

}