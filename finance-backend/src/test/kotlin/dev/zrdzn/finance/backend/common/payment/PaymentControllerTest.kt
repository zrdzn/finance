package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.PaymentCreateRequest
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.payment.PaymentMethod
import dev.zrdzn.finance.backend.api.price.PriceCurrency
import io.restassured.RestAssured.given
import java.math.BigDecimal
import org.hamcrest.Matchers.notNullValue
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class PaymentControllerTest : PaymentSpecification() {

    @Test
    fun `should create payment`() {
        val token = createUserAndAuthenticate()

        val paymentCreateRequest = PaymentCreateRequest(
            userId = token.userId,
            paymentMethod = PaymentMethod.CARD,
            description = "Test payment",
            price = BigDecimal("100.00"),
            currency = PriceCurrency.PLN
        )

        given()
            .contentType("application/json")
            .header("Authorization", "Bearer ${token.value}")
            .body(paymentCreateRequest)
            .`when`()
            .post("/payment/create")
            .then()
            .statusCode(HttpStatus.OK.value())
            .body("id", notNullValue())
    }

}