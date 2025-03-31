package dev.zrdzn.finance.backend.schedule

import dev.zrdzn.finance.backend.audit.AuditAction
import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.schedule.dto.ScheduleListResponse
import dev.zrdzn.finance.backend.schedule.dto.ScheduleResponse
import dev.zrdzn.finance.backend.schedule.error.ScheduleAmountNegativeError
import dev.zrdzn.finance.backend.schedule.error.ScheduleDescriptionInvalidError
import dev.zrdzn.finance.backend.schedule.error.ScheduleNotFoundError
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.TransactionService
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.vault.VaultPermission
import dev.zrdzn.finance.backend.vault.VaultService
import java.time.Clock
import java.time.Instant
import java.time.temporal.ChronoUnit
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val vaultService: VaultService,
    private val auditService: AuditService,
    private val transactionService: TransactionService,
    private val clock: Clock,
) {

    companion object {
        const val DESCRIPTION_MIN_LENGTH = 3
        const val DESCRIPTION_MAX_LENGTH = 255
    }

    @Transactional
    fun executeScheduledTransactions() {
        val now = Instant.now(clock)

        scheduleRepository.findByNextExecutionBefore(now).forEach { schedule ->
            val transaction = transactionService.getTransactionForcefully(schedule.transactionId)

            val products = transaction.products
                .products
                .map {
                    TransactionProductCreateRequest(
                        name = it.name,
                        categoryId = it.category?.id,
                        unitAmount = it.unitAmount,
                        quantity = it.quantity
                    )
                }
                .toSet()

            transactionService.createTransactionForcefully(
                userId = transaction.user.id,
                vaultId = transaction.vaultId,
                transactionMethod = transaction.transactionMethod,
                transactionType = transaction.transactionType,
                description = transaction.description,
                price = Price(
                    amount = transaction.total.abs(),
                    currency = transaction.currency
                ),
                products = products
            )

            schedule.nextExecution = calculateNextExecutionDate(schedule.scheduleInterval, schedule.intervalValue)
        }
    }

    @Transactional
    fun createSchedule(requesterId: Int, transactionId: Int, description: String, interval: ScheduleInterval, amount: Int): ScheduleResponse {
        val transaction = transactionService.getTransaction(requesterId, transactionId)

        if (description.length !in DESCRIPTION_MIN_LENGTH..DESCRIPTION_MAX_LENGTH) throw ScheduleDescriptionInvalidError()
        if (amount < 0) throw ScheduleAmountNegativeError()

        return vaultService.withAuthorization(transaction.vaultId, requesterId, VaultPermission.SCHEDULE_CREATE) {
            val nextExecutionDate = calculateNextExecutionDate(interval, amount)

            val schedule = scheduleRepository.save(
                Schedule(
                    id = null,
                    transactionId = transaction.id,
                    description = description,
                    nextExecution = nextExecutionDate,
                    scheduleInterval = interval,
                    intervalValue = amount
                )
            )

            auditService.createAudit(
                vaultId = transaction.vaultId,
                userId = requesterId,
                auditAction = AuditAction.SCHEDULE_CREATED,
                description = description
            )

            ScheduleResponse(
                id = schedule.id!!,
                transactionId = schedule.transactionId,
                description = schedule.description,
                nextExecution = schedule.nextExecution,
                interval = schedule.scheduleInterval,
                amount = schedule.intervalValue
            )
        }
    }

    @Transactional(readOnly = true)
    fun getSchedules(requesterId: Int, vaultId: Int): ScheduleListResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.SCHEDULE_READ) {
            scheduleRepository
                .findByVaultId(vaultId)
                .map {
                    ScheduleResponse(
                        id = it.id!!,
                        transactionId = it.transactionId,
                        description = it.description,
                        nextExecution = it.nextExecution,
                        interval = it.scheduleInterval,
                        amount = it.intervalValue
                    )
                }
                .toSet()
                .let { ScheduleListResponse(it) }
        }

    @Transactional(readOnly = true)
    fun getScheduleForcefully(scheduleId: Int): ScheduleResponse =
        scheduleRepository.findById(scheduleId)
            ?.let {
                ScheduleResponse(
                    id = it.id!!,
                    transactionId = it.transactionId,
                    description = it.description,
                    nextExecution = it.nextExecution,
                    interval = it.scheduleInterval,
                    amount = it.intervalValue
                )
            }
            ?: throw ScheduleNotFoundError()

    @Transactional
    fun deleteSchedule(requesterId: Int, scheduleId: Int) {
        val schedule = getScheduleForcefully(scheduleId)
        val transaction = transactionService.getTransaction(requesterId, schedule.transactionId)

        scheduleRepository.deleteById(scheduleId)

        auditService.createAudit(
            vaultId = transaction.vaultId,
            userId = requesterId,
            auditAction = AuditAction.SCHEDULE_DELETED,
            description = schedule.description
        )
    }

    private fun calculateNextExecutionDate(interval: ScheduleInterval, amount: Int): Instant {
        val now = Instant.now(clock)
        val convertedAmount = amount.toLong()
        return when (interval) {
            ScheduleInterval.HOUR -> now.plus(convertedAmount, ChronoUnit.HOURS)
            ScheduleInterval.DAY -> now.plus(convertedAmount, ChronoUnit.DAYS)
            ScheduleInterval.WEEK -> now.plus(convertedAmount * 7, ChronoUnit.DAYS)
            ScheduleInterval.MONTH -> now.plus(convertedAmount * 30, ChronoUnit.DAYS)
            ScheduleInterval.YEAR -> now.plus(convertedAmount * 365, ChronoUnit.DAYS)
        }
    }

}
