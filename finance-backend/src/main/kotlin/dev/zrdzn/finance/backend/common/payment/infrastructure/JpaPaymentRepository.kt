package dev.zrdzn.finance.backend.common.payment.infrastructure

import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.common.payment.Payment
import dev.zrdzn.finance.backend.common.payment.PaymentId
import dev.zrdzn.finance.backend.common.payment.PaymentRepository
import dev.zrdzn.finance.backend.common.vault.VaultId
import java.time.Instant
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component

@Component
interface JpaPaymentRepository : PaymentRepository, Repository<Payment, PaymentId> {

    @Query("""
        SELECT NEW dev.zrdzn.finance.backend.api.price.Price(SUM(payment.total), payment.currency)
        FROM Payment payment
        WHERE payment.vaultId = :vaultId
        GROUP BY payment.currency
    """)
    override fun sumAndGroupExpensesByVaultId(
        @Param("vaultId") vaultId: VaultId
    ): List<Price>

    @Query("""
        SELECT NEW dev.zrdzn.finance.backend.api.price.Price(SUM(payment.total), payment.currency)
        FROM Payment payment
        WHERE payment.vaultId = :vaultId AND payment.payedAt >= :start
        GROUP BY payment.currency
    """)
    override fun sumAndGroupExpensesByVaultId(
        @Param("vaultId") vaultId: VaultId,
        @Param("start") start: Instant
    ): List<Price>

    @Query("""
        SELECT GREATEST(TIMESTAMPDIFF(DAY, MIN(payment.payedAt), MAX(payment.payedAt)), 1)
        FROM Payment payment
    """)
    override fun countTotalDaysByVaultId(@Param("vaultId") vaultId: VaultId): Long

}