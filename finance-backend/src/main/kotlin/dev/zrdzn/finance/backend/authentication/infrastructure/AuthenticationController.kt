package dev.zrdzn.finance.backend.authentication.infrastructure

import dev.zrdzn.finance.backend.authentication.AuthenticationService
import dev.zrdzn.finance.backend.authentication.api.AuthenticationDetailsResponse
import dev.zrdzn.finance.backend.authentication.api.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.authentication.api.AuthenticationRegisterResponse
import dev.zrdzn.finance.backend.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserCreateRequest
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/authentication")
class AuthenticationController(
    private val userService: UserService,
    private val authenticationService: AuthenticationService
) {

    @PostMapping("/register")
    fun register(
        @RequestBody userCreateRequest: UserCreateRequest,
        response: HttpServletResponse
    ): AuthenticationRegisterResponse =
        userService
            .createUser(userCreateRequest)
            .let { AuthenticationRegisterResponse(it.userId) }

    @PostMapping("/login")
    fun login(
        @RequestBody authenticationLoginRequest: AuthenticationLoginRequest,
        response: HttpServletResponse
    ): AccessTokenResponse =
        authenticationService.authenticate(authenticationLoginRequest)
            .also { addAuthenticationCookie(response, it.value) }

    @PostMapping("/logout")
    fun logout(
        @AuthenticationPrincipal userId: UserId,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): Unit? =
        request.cookies.firstOrNull { it.name == TOKEN_COOKIE_NAME }
            ?.let { authenticationService.logout(it.value) }
            ?.also { invalidateAuthenticationCookie(response) }

    @GetMapping("/details")
    fun getDetails(@AuthenticationPrincipal userId: UserId): ResponseEntity<AuthenticationDetailsResponse> =
        authenticationService.getAuthenticationDetailsByUserId(userId)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    private fun addAuthenticationCookie(response: HttpServletResponse, token: String) {
        val cookie = Cookie(TOKEN_COOKIE_NAME, token)
        cookie.path = "/"
        cookie.secure = true
        cookie.isHttpOnly = true
        response.addCookie(cookie)
    }

    private fun invalidateAuthenticationCookie(response: HttpServletResponse) {
        val cookie = Cookie(TOKEN_COOKIE_NAME, null)
        cookie.path = "/"
        cookie.secure = true
        cookie.isHttpOnly = true
        cookie.maxAge = 0
        response.addCookie(cookie)
    }

}