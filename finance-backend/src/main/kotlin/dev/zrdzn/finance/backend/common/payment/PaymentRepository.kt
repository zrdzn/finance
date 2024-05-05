package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.common.vault.VaultId

interface PaymentRepository {

    fun save(payment: Payment): Payment

    fun findByVaultId(vaultId: VaultId): Set<Payment>

}