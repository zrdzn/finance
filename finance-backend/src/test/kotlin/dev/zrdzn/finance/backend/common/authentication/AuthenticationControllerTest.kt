package dev.zrdzn.finance.backend.common.authentication

import dev.zrdzn.finance.backend.common.authentication.token.TOKEN_COOKIE_NAME
import io.restassured.RestAssured.given
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.notNullValue
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class AuthenticationControllerTest : AuthenticationSpecification() {

    @Test
    fun `should register account`() {
        val userCreateRequest = createUserCreateRequest()

        given()
            .contentType("application/json")
            .body(userCreateRequest)
            .`when`()
            .post("/authentication/register")
            .then()
            .statusCode(HttpStatus.OK.value())
    }

    @Test
    fun `should login`() {
        val email = "test@email.com"
        val password = "safePassword"

        createUser(email = email, password = password)

        val authenticationLoginRequest = createAuthenticationLoginRequest(email = email, password = password)

        given()
            .contentType("application/json")
            .body(authenticationLoginRequest)
            .`when`()
            .post("/authentication/login")
            .then()
            .statusCode(HttpStatus.OK.value())
            .cookie(TOKEN_COOKIE_NAME, notNullValue())
    }

    @Test
    fun `should get details`() {
        val token = createUserAndAuthenticate()

        given()
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .`when`()
            .get("/authentication/details")
            .then()
            .statusCode(HttpStatus.OK.value())
            .body("email", equalTo(token.email))
    }

}