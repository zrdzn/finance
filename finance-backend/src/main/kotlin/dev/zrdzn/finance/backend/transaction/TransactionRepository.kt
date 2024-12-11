package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.price.Price
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import java.time.Instant

interface TransactionRepository {

    fun save(transaction: Transaction): Transaction

    fun deleteById(transactionId: Int)

    fun findById(transactionId: Int): Transaction?

    fun findByVaultId(vaultId: Int): Set<Transaction>

    fun findByVaultIdAndCreatedAtBetween(vaultId: Int, startDate: Instant, endDate: Instant): Set<Transaction>

    fun countByVaultId(vaultId: Int): Long

    fun sumAndGroupFlowsByVaultIdAndTransactionType(vaultId: Int, transactionType: TransactionType, start: Instant): List<Price>

    fun countTotalDaysByVaultId(vaultId: Int): Long

}