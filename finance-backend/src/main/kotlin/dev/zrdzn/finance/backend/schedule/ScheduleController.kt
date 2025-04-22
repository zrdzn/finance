package dev.zrdzn.finance.backend.schedule

import dev.zrdzn.finance.backend.schedule.dto.ScheduleCreateRequest
import dev.zrdzn.finance.backend.schedule.dto.ScheduleListResponse
import dev.zrdzn.finance.backend.schedule.dto.ScheduleResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/schedules")
class ScheduleController(
    private val scheduleService: ScheduleService
) {

    @PostMapping("/create/{transactionId}")
    fun createSchedule(
        @AuthenticationPrincipal userId: Int,
        @PathVariable transactionId: Int,
        @RequestBody scheduleCreateRequest: ScheduleCreateRequest
    ): ScheduleResponse =
        scheduleService.createSchedule(
            requesterId = userId,
            transactionId = transactionId,
            description = scheduleCreateRequest.description,
            interval = scheduleCreateRequest.interval,
            amount = scheduleCreateRequest.amount
        )

    @GetMapping("/vault/{vaultId}")
    fun getSchedulesByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): ScheduleListResponse = scheduleService.getSchedules(userId, vaultId)

    @DeleteMapping("/{scheduleId}")
    fun deleteScheduleById(
        @AuthenticationPrincipal userId: Int,
        @PathVariable scheduleId: Int
    ): Unit = scheduleService.deleteSchedule(userId, scheduleId)

}