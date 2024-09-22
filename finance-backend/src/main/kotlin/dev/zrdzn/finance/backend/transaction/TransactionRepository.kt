package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import dev.zrdzn.finance.backend.vault.VaultId
import java.time.Instant

interface TransactionRepository {

    fun save(transaction: Transaction): Transaction

    fun deleteById(transactionId: TransactionId)

    fun findById(transactionId: TransactionId): Transaction?

    fun findByVaultId(vaultId: VaultId): Set<Transaction>

    fun findByVaultIdAndCreatedAtBetween(vaultId: VaultId, startDate: Instant, endDate: Instant): Set<Transaction>

    fun countByVaultId(vaultId: VaultId): Long

    fun sumAndGroupFlowsByVaultIdAndTransactionType(vaultId: VaultId, transactionType: TransactionType, start: Instant): List<Price>

    fun countTotalDaysByVaultId(vaultId: VaultId): Long

}