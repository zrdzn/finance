package dev.zrdzn.finance.backend.authentication.infrastructure

import dev.zrdzn.finance.backend.authentication.AuthenticationService
import dev.zrdzn.finance.backend.authentication.api.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserCreateRequest
import dev.zrdzn.finance.backend.user.api.UserResponse
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

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
    ): UserResponse =
        userService.createUser(userCreateRequest)

    @PostMapping("/login")
    fun login(
        @RequestBody authenticationLoginRequest: AuthenticationLoginRequest,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): AccessTokenResponse {
        val ipAddress = request.getHeader("X-Forwarded-For") ?: request.remoteAddr

        return authenticationService.authenticate(authenticationLoginRequest, ipAddress = ipAddress)
            .also { addAuthenticationCookie(response, it.value) }
    }

    @PostMapping("/logout")
    fun logout(
        @AuthenticationPrincipal userId: Int,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): Unit? =
        request.cookies.firstOrNull { it.name == TOKEN_COOKIE_NAME }
            ?.let { authenticationService.logout(it.value) }
            ?.also { invalidateAuthenticationCookie(response) }

    @GetMapping("/details")
    fun getAuthenticationDetails(@AuthenticationPrincipal userId: Int): UserResponse =
        authenticationService.getAuthenticationDetails(userId)

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
