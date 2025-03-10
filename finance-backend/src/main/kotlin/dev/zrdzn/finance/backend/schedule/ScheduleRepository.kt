package dev.zrdzn.finance.backend.schedule

import java.time.Instant
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository

interface ScheduleRepository : Repository<Schedule, Int> {

    fun save(schedule: Schedule): Schedule

    fun deleteById(scheduleId: Int)

    fun findById(scheduleId: Int): Schedule?

    @Query("""
        SELECT schedule FROM Schedule schedule 
        INNER JOIN Transaction transaction ON schedule.transactionId = transaction.id
        WHERE transaction.vaultId = :vaultId
    """)
    fun findByVaultId(vaultId: Int): Set<Schedule>

    fun findByNextExecutionBefore(now: Instant): Set<Schedule>

}