package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.common.payment.api.PaymentCreateRequest
import dev.zrdzn.finance.backend.common.payment.api.PaymentCreateResponse
import dev.zrdzn.finance.backend.common.payment.api.PaymentMethod
import dev.zrdzn.finance.backend.api.price.PriceCurrency
import dev.zrdzn.finance.backend.common.authentication.token.TOKEN_COOKIE_NAME
import java.math.BigDecimal
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class TransactionControllerTest : TransactionSpecification() {

    @Test
    fun `should create payment`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val paymentCreateRequest = PaymentCreateRequest(
            vaultId = vault.id,
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