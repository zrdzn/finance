package dev.zrdzn.finance.backend.schedule

import java.util.concurrent.TimeUnit
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class ScheduleExecutor(
    private val scheduleService: ScheduleService
) {

    private val logger = LoggerFactory.getLogger(ScheduleExecutor::class.java)

    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.HOURS)
    fun executeScheduledTransactions() {
        logger.info("Executing scheduled transactions")
        scheduleService.executeScheduledTransactions()
    }


}