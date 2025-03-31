package dev.zrdzn.finance.backend.schedule

import dev.zrdzn.finance.backend.schedule.dto.ScheduleCreateRequest
import dev.zrdzn.finance.backend.schedule.dto.ScheduleResponse
import dev.zrdzn.finance.backend.token.TOKEN_COOKIE_NAME
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class ScheduleControllerTest : ScheduleSpecification() {

    @Test
    fun `should create schedule`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        val description = "Test schedule"
        val interval = ScheduleInterval.DAY
        val amount = 10

        val request = ScheduleCreateRequest(
            description = description,
            interval = interval,
            amount = amount
        )

        // when
        val response = Unirest.post("/schedules/create/${transaction.id}")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(ScheduleResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), response.status)
        assertNotNull(response.body)

        val expectedSchedule = scheduleRepository.findById(response.body.id)
        assertNotNull(expectedSchedule)
        assertEquals(transaction.id, expectedSchedule!!.transactionId)
        assertEquals(description, expectedSchedule.description)
        assertEquals(interval, expectedSchedule.scheduleInterval)
        assertEquals(amount, expectedSchedule.intervalValue)
    }

    @Test
    fun `should delete schedule by id`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        val schedule = createSchedule(
            requesterId = token.userId,
            transactionId = transaction.id
        )

        // when
        val response = Unirest.delete("/schedules/${schedule.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedSchedule = scheduleRepository.findById(schedule.id)
        assertNull(expectedSchedule)

        assertEquals(HttpStatus.OK.value(), response.status)
    }

}