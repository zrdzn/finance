package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.common.authentication.api.AuthenticationDetailsResponse
import dev.zrdzn.finance.backend.common.authentication.api.AuthenticationRegisterResponse
import dev.zrdzn.finance.backend.common.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.common.authentication.token.TOKEN_COOKIE_NAME
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class AuthenticationControllerTest : AuthenticationSpecification() {

    @Test
    fun `should register account`() {
        // given
        val userCreateRequest = createUserCreateRequest()

        // when
        val authenticationRegisterResponse = Unirest.post("/authentication/register")
            .contentType("application/json")
            .body(userCreateRequest)
            .asObject(AuthenticationRegisterResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), authenticationRegisterResponse.status)
        assertNotNull(authenticationRegisterResponse.body)
    }

    @Test
    fun `should login`() {
        // given
        val email = "test@email.com"
        val password = "safePassword"

        createUser(email = email, password = password)

        val authenticationLoginRequest = createAuthenticationLoginRequest(email = email, password = password)

        // when
        val authenticationLoginResponse = Unirest.post("/authentication/login")
            .contentType("application/json")
            .body(authenticationLoginRequest)
            .asObject(AccessTokenResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), authenticationLoginResponse.status)
        assertNotNull(authenticationLoginResponse.body)
        assertNotNull(authenticationLoginResponse.cookies.firstOrNull { it.name == TOKEN_COOKIE_NAME })
    }

    @Test
    fun `should get details`() {
        // given
        val token = createUserAndAuthenticate()

        // when
        val authenticationDetailsResponse = Unirest.get("/authentication/details")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(AuthenticationDetailsResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), authenticationDetailsResponse.status)
        assertNotNull(authenticationDetailsResponse.body)
        assertEquals(token.email, authenticationDetailsResponse.body.email)
    }

}