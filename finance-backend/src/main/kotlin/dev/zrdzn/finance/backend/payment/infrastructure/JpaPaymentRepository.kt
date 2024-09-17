package dev.zrdzn.finance.backend.payment.infrastructure

import dev.zrdzn.finance.backend.payment.Payment
import dev.zrdzn.finance.backend.payment.PaymentId
import dev.zrdzn.finance.backend.payment.PaymentRepository
import dev.zrdzn.finance.backend.payment.api.PaymentRawChartData
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.vault.VaultId
import java.time.Instant
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component

@Component
interface JpaPaymentRepository : PaymentRepository, Repository<Payment, PaymentId> {

    @Query(
        """
        SELECT NEW dev.zrdzn.finance.backend.shared.Price(SUM(payment.total), payment.currency)
        FROM Payment payment
        WHERE payment.vaultId = :vaultId
        GROUP BY payment.currency
    """
    )
    override fun sumAndGroupExpensesByVaultId(
        @Param("vaultId") vaultId: VaultId
    ): List<Price>

    @Query(
        """
        SELECT NEW dev.zrdzn.finance.backend.shared.Price(SUM(payment.total), payment.currency)
        FROM Payment payment
        WHERE payment.vaultId = :vaultId AND payment.createdAt >= :start
        GROUP BY payment.currency
    """
    )
    override fun sumAndGroupExpensesByVaultId(
        @Param("vaultId") vaultId: VaultId,
        @Param("start") start: Instant
    ): List<Price>

    @Query(
        """
        SELECT GREATEST(TIMESTAMPDIFF(DAY, MIN(payment.createdAt), MAX(payment.createdAt)), 1)
        FROM Payment payment
    """
    )
    override fun countTotalDaysByVaultId(@Param("vaultId") vaultId: VaultId): Long

    @Query("""
        SELECT new dev.zrdzn.finance.backend.payment.api.PaymentRawChartData(
            FUNCTION('date_trunc', 'day', payment.createdAt), 
            SUM(payment.total)
        )    
        FROM Payment payment WHERE payment.createdAt >= :startDate AND payment.vaultId = :vaultId 
        GROUP BY FUNCTION('date_trunc', 'day', payment.createdAt) 
        ORDER BY FUNCTION('date_trunc', 'day', payment.createdAt)
    """)
    override fun findDailyExpenses(@Param("startDate") startDate: Instant, @Param("vaultId") vaultId: VaultId): List<PaymentRawChartData>

    @Query("""
        SELECT new dev.zrdzn.finance.backend.payment.api.PaymentRawChartData(
            FUNCTION('date_trunc', 'week', payment.createdAt), 
            SUM(payment.total)
        )    
        FROM Payment payment WHERE payment.createdAt >= :startDate AND payment.vaultId = :vaultId 
        GROUP BY FUNCTION('date_trunc', 'week', payment.createdAt) 
        ORDER BY FUNCTION('date_trunc', 'week', payment.createdAt)
    """)
    override fun findWeeklyExpenses(@Param("startDate") startDate: Instant, @Param("vaultId") vaultId: VaultId): List<PaymentRawChartData>

    @Query("""
        SELECT new dev.zrdzn.finance.backend.payment.api.PaymentRawChartData(
            FUNCTION('date_trunc', 'month', payment.createdAt), 
            SUM(payment.total)
        )     
        FROM Payment payment WHERE payment.createdAt >= :startDate AND payment.vaultId = :vaultId 
        GROUP BY FUNCTION('date_trunc', 'month', payment.createdAt) 
        ORDER BY FUNCTION('date_trunc', 'month', payment.createdAt)
    """)
    override fun findMonthlyExpenses(@Param("startDate") startDate: Instant, @Param("vaultId") vaultId: VaultId): List<PaymentRawChartData>

    @Query("""
        SELECT new dev.zrdzn.finance.backend.payment.api.PaymentRawChartData(
            FUNCTION('date_trunc', 'year', payment.createdAt), 
            SUM(payment.total)
        )    
        FROM Payment payment WHERE payment.createdAt >= :startDate AND payment.vaultId = :vaultId 
        GROUP BY FUNCTION('date_trunc', 'year', payment.createdAt) 
        ORDER BY FUNCTION('date_trunc', 'year', payment.createdAt)
    """)
    override fun findYearlyExpenses(@Param("startDate") startDate: Instant, @Param("vaultId") vaultId: VaultId): List<PaymentRawChartData>

}