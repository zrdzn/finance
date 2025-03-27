package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.shared.Price
import java.time.Instant
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository

interface TransactionRepository : Repository<Transaction, Int> {

    fun save(transaction: Transaction): Transaction

    fun deleteById(transactionId: Int)

    fun findById(transactionId: Int): Transaction?

    fun findByVaultId(vaultId: Int): Set<Transaction>

    fun findByVaultIdAndCreatedAtBetween(vaultId: Int, startDate: Instant, endDate: Instant): Set<Transaction>

    fun countByVaultId(vaultId: Int): Long

    @Query(
        """
        SELECT COUNT(transaction)
        FROM Transaction transaction
        WHERE transaction.vaultId = :vaultId
          AND transaction.transactionType = :transactionType
          AND transaction.createdAt >= :start
    """
    )
    fun countByVaultIdAndTransactionType(vaultId: Int, transactionType: TransactionType, start: Instant): Long

    @Query(
        """
        SELECT NEW dev.zrdzn.finance.backend.shared.Price(SUM(transaction.total), transaction.currency)
        FROM Transaction transaction
        WHERE transaction.vaultId = :vaultId
            AND transaction.transactionType = :transactionType
            AND transaction.createdAt >= :start
        GROUP BY transaction.currency
    """)
    fun sumAndGroupFlowsByVaultIdAndTransactionType(vaultId: Int, transactionType: TransactionType, start: Instant): List<Price>

    @Query(value = """
        SELECT
            CAST(EXTRACT(MONTH FROM transaction.created_at) AS INTEGER) AS month,
            CAST(EXTRACT(YEAR FROM transaction.created_at) AS INTEGER) AS year,
            SUM(CASE WHEN transaction.transaction_type = 'INCOMING' THEN transaction.total ELSE 0 END) AS incoming,
            SUM(CASE WHEN transaction.transaction_type = 'OUTGOING' THEN transaction.total ELSE 0 END) AS outgoing
        FROM transactions transaction
        WHERE transaction.vault_id = :vaultId 
            AND transaction.created_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY
            CAST(EXTRACT(MONTH FROM transaction.created_at) AS INTEGER),
            CAST(EXTRACT(YEAR FROM transaction.created_at) AS INTEGER)
        ORDER BY
            CAST(EXTRACT(MONTH FROM transaction.created_at) AS INTEGER),
            CAST(EXTRACT(YEAR FROM transaction.created_at) AS INTEGER)
    """, nativeQuery = true)
    fun getMonthlyTransactionSums(vaultId: Int): List<Array<Any>>

}