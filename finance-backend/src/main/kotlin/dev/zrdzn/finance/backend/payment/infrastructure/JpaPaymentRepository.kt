package dev.zrdzn.finance.backend.payment.infrastructure

import dev.zrdzn.finance.backend.payment.Payment
import dev.zrdzn.finance.backend.payment.PaymentId
import dev.zrdzn.finance.backend.payment.PaymentRepository
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
        WHERE payment.vaultId = :vaultId AND payment.payedAt >= :start
        GROUP BY payment.currency
    """
    )
    override fun sumAndGroupExpensesByVaultId(
        @Param("vaultId") vaultId: VaultId,
        @Param("start") start: Instant
    ): List<Price>

    @Query(
        """
        SELECT GREATEST(TIMESTAMPDIFF(DAY, MIN(payment.payedAt), MAX(payment.payedAt)), 1)
        FROM Payment payment
    """
    )
    override fun countTotalDaysByVaultId(@Param("vaultId") vaultId: VaultId): Long

}