package dev.zrdzn.finance.backend.transaction.domain

import java.time.Instant

interface ScheduleRepository {

    fun save(schedule: Schedule): Schedule

    fun deleteById(scheduleId: Int)

    fun findById(scheduleId: Int): Schedule?

    fun findByVaultId(vaultId: Int): Set<Schedule>

    fun findByNextExecutionBefore(now: Instant): Set<Schedule>

}