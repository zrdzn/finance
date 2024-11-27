package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.transaction.TransactionService
import java.util.concurrent.TimeUnit
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class ScheduleExecutor(
    private val transactionService: TransactionService
) {

    private val logger = LoggerFactory.getLogger(ScheduleExecutor::class.java)

    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.HOURS)
    fun executeSchedules() {
        logger.info("Executing scheduled transactions")
        transactionService.executeSchedules()
    }


}