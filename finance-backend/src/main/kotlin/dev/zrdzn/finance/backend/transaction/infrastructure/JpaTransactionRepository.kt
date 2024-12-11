package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.price.Price
import dev.zrdzn.finance.backend.transaction.Transaction
import dev.zrdzn.finance.backend.transaction.TransactionRepository
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import java.time.Instant
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component

@Component
interface JpaTransactionRepository : TransactionRepository, Repository<Transaction, Int> {

    @Query(
        """
        SELECT NEW dev.zrdzn.finance.backend.price.Price(SUM(transaction.total), transaction.currency)
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

}