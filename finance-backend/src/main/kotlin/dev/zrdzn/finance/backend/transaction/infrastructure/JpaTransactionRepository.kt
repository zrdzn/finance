package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.domain.Transaction
import dev.zrdzn.finance.backend.transaction.domain.TransactionRepository
import dev.zrdzn.finance.backend.transaction.domain.TransactionType
import java.time.Instant
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component

@Component
interface JpaTransactionRepository : TransactionRepository, Repository<Transaction, Int> {

    @Query(
        """
        SELECT NEW dev.zrdzn.finance.backend.shared.Price(SUM(transaction.total), transaction.currency)
        FROM Transaction transaction
        WHERE transaction.vaultId = :vaultId
        AND transaction.transactionType = :transactionType
        AND transaction.createdAt >= :start
        GROUP BY transaction.currency
    """
    )
    override fun sumAndGroupFlowsByVaultIdAndTransactionType(
        @Param("vaultId") vaultId: Int,
        @Param("transactionType") transactionType: TransactionType,
        @Param("start") start: Instant
    ): List<Price>

    @Query(
        """
        SELECT GREATEST(TIMESTAMPDIFF(DAY, MIN(transaction.createdAt), MAX(transaction.createdAt)), 1)
        FROM Transaction transaction
        WHERE transaction.vaultId = :vaultId
    """
    )
    override fun countTotalDaysByVaultId(@Param("vaultId") vaultId: Int): Long

    @Query(
        """
        SELECT COUNT(transaction)
        FROM Transaction transaction
        WHERE transaction.vaultId = :vaultId
          AND transaction.transactionType = :transactionType
          AND transaction.createdAt >= :start
    """
    )
    override fun countByVaultIdAndTransactionType(
        vaultId: Int,
        transactionType: TransactionType,
        start: Instant
    ): Long

    @Query(value = """
        SELECT
            CAST(EXTRACT(MONTH FROM transaction.created_at) AS INTEGER) AS month,
            SUM(CASE WHEN transaction.transaction_type = 'INCOMING' THEN transaction.total ELSE 0 END) AS incoming,
            SUM(CASE WHEN transaction.transaction_type = 'OUTGOING' THEN transaction.total ELSE 0 END) AS outgoing
        FROM
            transactions transaction,
            vaults vault
        WHERE
            vault.id = :vaultId
            AND transaction.created_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY
            CAST(EXTRACT(MONTH FROM transaction.created_at) AS INTEGER)
        ORDER BY
            CAST(EXTRACT(MONTH FROM transaction.created_at) AS INTEGER)
    """, nativeQuery = true)
    override fun getMonthlyTransactionSums(
        @Param("vaultId") vaultId: Int
    ): List<Array<Any>>

}