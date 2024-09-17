package dev.zrdzn.finance.backend.payment

import dev.zrdzn.finance.backend.payment.api.PaymentRawChartData
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.vault.VaultId
import java.time.Instant

interface PaymentRepository {

    fun save(payment: Payment): Payment

    fun deleteById(paymentId: PaymentId)

    fun findById(paymentId: PaymentId): Payment?

    fun findByVaultId(vaultId: VaultId): Set<Payment>

    fun findByVaultIdAndCreatedAtBetween(vaultId: VaultId, startDate: Instant, endDate: Instant): Set<Payment>

    fun countByVaultId(vaultId: VaultId): Long

    fun sumAndGroupExpensesByVaultId(vaultId: VaultId): List<Price>

    fun sumAndGroupExpensesByVaultId(vaultId: VaultId, start: Instant): List<Price>

    fun countTotalDaysByVaultId(vaultId: VaultId): Long

    fun findDailyExpenses(startDate: Instant, vaultId: VaultId): List<PaymentRawChartData>

    fun findWeeklyExpenses(startDate: Instant, vaultId: VaultId): List<PaymentRawChartData>

    fun findMonthlyExpenses(startDate: Instant, vaultId: VaultId): List<PaymentRawChartData>

    fun findYearlyExpenses(startDate: Instant, vaultId: VaultId): List<PaymentRawChartData>

}