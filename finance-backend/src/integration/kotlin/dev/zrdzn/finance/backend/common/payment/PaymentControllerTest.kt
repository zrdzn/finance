package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.PaymentCreateRequest
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.payment.PaymentMethod
import dev.zrdzn.finance.backend.api.price.PriceCurrency
import dev.zrdzn.finance.backend.common.authentication.token.TOKEN_COOKIE_NAME
import java.math.BigDecimal
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class PaymentControllerTest : PaymentSpecification() {

    @Test
    fun `should create payment`() {
        // given
        val token = createUserAndAuthenticate()

        val paymentCreateRequest = PaymentCreateRequest(
            userId = token.userId,
            paymentMethod = PaymentMethod.CARD,
            description = "Test payment",
            price = BigDecimal("100.00"),
            currency = PriceCurrency.PLN
        )

        // when
        val paymentCreateResponse = Unirest.post("/payment/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(paymentCreateRequest)
            .asObject(PaymentCreateResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), paymentCreateResponse.status)
        assertNotNull(paymentCreateResponse.body)
    }

}