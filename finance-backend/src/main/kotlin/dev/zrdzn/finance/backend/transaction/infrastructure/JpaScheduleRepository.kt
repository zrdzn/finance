package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.transaction.domain.Schedule
import dev.zrdzn.finance.backend.transaction.domain.ScheduleRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaScheduleRepository : ScheduleRepository, Repository<Schedule, Int> {

    @Query("""
        SELECT schedule FROM Schedule schedule 
        INNER JOIN Transaction transaction ON schedule.transactionId = transaction.id
        WHERE transaction.vaultId = :vaultId
    """)
    override fun findByVaultId(vaultId: Int): Set<Schedule>

}