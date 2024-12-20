package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.user.api.UserResponse
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class AuthenticationControllerTest : AuthenticationSpecification() {

    @Test
    fun `should register account`() {
        // given
        val userCreateRequest = createUserCreateRequest(
            email = "test@app.com",
            username = "test",
            password = "password"
        )

        // when
        val authenticationRegisterResponse = Unirest.post("/authentication/register")
            .contentType("application/json")
            .body(userCreateRequest)
            .asObject(UserResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), authenticationRegisterResponse.status)
        assertNotNull(authenticationRegisterResponse.body)
        assertEquals(userCreateRequest.email, authenticationRegisterResponse.body.email)
        assertEquals(userCreateRequest.username, authenticationRegisterResponse.body.username)
    }

    @Test
    fun `should not register account with the same email`() {
        // given
        val email = "test@app.com"

        val user1Username = "test"
        val user1Password = "password"
        val user1 = createUser(email = email, username = user1Username, password = user1Password)

        val userCreateRequest = createUserCreateRequest(
            email = email,
            username = "test2",
            password = "password2"
        )

        // when
        val authenticationRegisterResponse = Unirest.post("/authentication/register")
            .contentType("application/json")
            .body(userCreateRequest)
            .asObject(UserResponse::class.java)

        // then
        assertEquals(HttpStatus.CONFLICT.value(), authenticationRegisterResponse.status)
        assertEquals(user1.email, email)
        assertEquals(user1.username, user1Username)
        assertNotNull(authenticationRegisterResponse.body)
    }

    @Test
    fun `should login`() {
        // given
        val email = "test@app.com"
        val username = "test"
        val password = "password"

        val user = createUser(email = email, username = username, password = password)

        val authenticationLoginRequest = createAuthenticationLoginRequest(
            email = email,
            password = password,
            oneTimePassword = null
        )

        // when
        val authenticationLoginResponse = Unirest.post("/authentication/login")
            .contentType("application/json")
            .body(authenticationLoginRequest)
            .asObject(AccessTokenResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), authenticationLoginResponse.status)
        assertNotNull(authenticationLoginResponse.body)
        assertEquals(user.id, authenticationLoginResponse.body.userId)
        assertEquals(user.email, authenticationLoginResponse.body.email)
        assertEquals(email, authenticationLoginResponse.body.email)
        assertNotNull(authenticationLoginResponse.body.value)
        assertNotNull(authenticationLoginResponse.body.refreshTokenId)
        assertNotNull(authenticationLoginResponse.cookies.firstOrNull { it.name == TOKEN_COOKIE_NAME })
    }

    @Test
    fun `should logout`() {
        // given
        val userCreateRequest = createUserCreateRequest(
            email = "test@app.com",
            username = "test",
            password = "password"
        )

        val ipAddress = "192.168.8.10"

        val token = createUserAndAuthenticate(userCreateRequest = userCreateRequest, ipAddress = ipAddress)

        // when
        val authenticationLogoutResponse = Unirest.post("/authentication/logout")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        assertEquals(HttpStatus.OK.value(), authenticationLogoutResponse.status)
        assertNotEquals(token.value, authenticationLogoutResponse.cookies.firstOrNull { it.name == TOKEN_COOKIE_NAME }?.value)
    }

    @Test
    fun `should get details`() {
        // given
        val userCreateRequest = createUserCreateRequest(
            email = "test@app.com",
            username = "test",
            password = "password"
        )

        val ipAddress = "192.168.8.10"

        val token = createUserAndAuthenticate(userCreateRequest = userCreateRequest, ipAddress = ipAddress)

        // when
        val authenticationDetailsResponse = Unirest.get("/authentication/details")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(UserResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), authenticationDetailsResponse.status)
        assertNotNull(authenticationDetailsResponse.body)
        assertEquals(token.userId, authenticationDetailsResponse.body.id)
        assertEquals(token.email, authenticationDetailsResponse.body.email)
    }

}