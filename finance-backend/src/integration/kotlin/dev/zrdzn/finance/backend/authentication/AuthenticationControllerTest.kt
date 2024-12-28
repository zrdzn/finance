package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.api.FinanceApiException
import dev.zrdzn.finance.backend.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.user.api.UserResponse
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class AuthenticationControllerTest : AuthenticationSpecification() {

    @Test
    fun `should register account`() {
        // given
        val request = createUserCreateRequest(
            email = "test@app.com",
            username = "test",
            password = "password"
        )

        // when
        val response = Unirest.post("/authentication/register")
            .contentType("application/json")
            .body(request)
            .asObject(UserResponse::class.java)

        // then
        val expectedUser = userRepository.findByEmail(request.email)
        assertNotNull(expectedUser)
        assertEquals(request.email, expectedUser!!.email)
        assertEquals(request.username, expectedUser.username)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
        assertEquals(request.email, response.body.email)
        assertEquals(request.username, response.body.username)
    }

    @Test
    fun `should not register account with the same email`() {
        // given
        val user = createUser()

        val username = "test2"
        val request = createUserCreateRequest(
            email = user.email,
            username = username,
            password = "password2"
        )

        // when
        val response = Unirest.post("/authentication/register")
            .contentType("application/json")
            .body(request)
            .asObject(FinanceApiException::class.java)

        // then
        val expectedUserId = userRepository.findIdByUsername(username)
        assertNull(expectedUserId)

        assertNotNull(response.body)
        assertEquals(HttpStatus.CONFLICT.value(), response.status)
        assertEquals(response.body.status, HttpStatus.CONFLICT.value())
        assertEquals(user.email, user.email)
        assertEquals(user.username, user.username)
    }

    @Test
    fun `should login`() {
        // given
        val password = "password"
        val user = createUser(password = password)

        val request = createAuthenticationLoginRequest(
            email = user.email,
            password = password,
            oneTimePassword = null
        )

        // when
        val response = Unirest.post("/authentication/login")
            .contentType("application/json")
            .body(request)
            .asObject(AccessTokenResponse::class.java)

        // then
        val expectedTokens = tokenRepository.findByUserId(user.id)
        assertNotNull(expectedTokens.firstOrNull())

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
        assertEquals(user.id, response.body.userId)
        assertEquals(user.email, response.body.email)
        assertNotNull(response.body.value)
        assertNotNull(response.body.refreshTokenId)
        assertNotNull(response.cookies.firstOrNull { it.name == TOKEN_COOKIE_NAME })
    }

    @Test
    fun `should not login with invalid credentials`() {
        // given
        val user = createUser()

        val request = createAuthenticationLoginRequest(
            email = user.email,
            password = "invalid",
            oneTimePassword = null
        )

        // when
        val response = Unirest.post("/authentication/login")
            .contentType("application/json")
            .body(request)
            .asObject(FinanceApiException::class.java)

        // then
        val expectedTokens = tokenRepository.findByUserId(user.id)
        assertNull(expectedTokens.firstOrNull())

        assertNotNull(response.body)
        assertEquals(response.body.status, HttpStatus.UNAUTHORIZED.value())
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.status)
    }

    @Test
    fun `should logout`() {
        // given
        val token = createUserAndAuthenticate()

        // when
        val response = Unirest.post("/authentication/logout")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedTokens = tokenRepository.findByUserId(token.userId)
        assertNull(expectedTokens.firstOrNull())

        assertEquals(HttpStatus.OK.value(), response.status)
        assertNotEquals(token.value, response.cookies.firstOrNull { it.name == TOKEN_COOKIE_NAME }?.value)
    }

    @Test
    fun `should get details`() {
        // given
        val token = createUserAndAuthenticate()

        // when
        val response = Unirest.get("/authentication/details")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(UserResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), response.status)
        assertNotNull(response.body)
        assertEquals(token.userId, response.body.id)
        assertEquals(token.email, response.body.email)
    }

    @Test
    fun `should not get details without token`() {
        // given
        createUserAndAuthenticate()

        // when
        val authenticationDetailsResponse = Unirest.get("/authentication/details")
            .asObject(UserResponse::class.java)

        // then
        assertEquals(HttpStatus.UNAUTHORIZED.value(), authenticationDetailsResponse.status)
    }

}