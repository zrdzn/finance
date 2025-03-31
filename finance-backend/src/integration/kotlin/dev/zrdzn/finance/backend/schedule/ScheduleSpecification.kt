package dev.zrdzn.finance.backend.schedule

import dev.zrdzn.finance.backend.schedule.dto.ScheduleResponse
import dev.zrdzn.finance.backend.transaction.TransactionSpecification

open class ScheduleSpecification : TransactionSpecification() {

    protected val scheduleService: ScheduleService get() = application.getBean(ScheduleService::class.java)
    protected val scheduleRepository: ScheduleRepository get() = application.getBean(ScheduleRepository::class.java)

    fun createSchedule(
        requesterId: Int,
        transactionId: Int,
        description: String = "Test schedule",
        interval: ScheduleInterval = ScheduleInterval.DAY,
        amount: Int = 10
    ): ScheduleResponse =
        scheduleService.createSchedule(
            requesterId = requesterId,
            transactionId = transactionId,
            description = description,
            interval = interval,
            amount = amount,
        )

}