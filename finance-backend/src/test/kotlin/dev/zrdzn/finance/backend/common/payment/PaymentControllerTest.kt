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
        val user = createUser()

        val paymentCreateRequest = PaymentCreateRequest(
            userId = user.userId,
            paymentMethod = PaymentMethod.CARD,
            description = "Test payment",
            price = BigDecimal("100.00"),
            currency = PriceCurrency.PLN
        )

        given()
            .contentType("application/json")
            .body(paymentCreateRequest)
            .`when`()
            .post("/api/payment/create")
            .then()
            .statusCode(HttpStatus.OK.value())
            .body("id", notNullValue())
    }

}