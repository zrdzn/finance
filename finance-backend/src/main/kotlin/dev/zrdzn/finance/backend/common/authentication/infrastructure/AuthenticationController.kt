package dev.zrdzn.finance.backend.common.authentication.infrastructure

import dev.zrdzn.finance.backend.api.authentication.AuthenticationDetailsResponse
import dev.zrdzn.finance.backend.api.authentication.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.api.authentication.AuthenticationRegisterResponse
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenResponse
import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.common.authentication.AuthenticationService
import dev.zrdzn.finance.backend.common.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.common.user.UserService
import dev.zrdzn.finance.backend.common.user.UserId
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
    ): ResponseEntity<AuthenticationRegisterResponse> =
        userService
            .createUser(userCreateRequest)
            .let { AuthenticationRegisterResponse(it.userId) }
            .let { ResponseEntity.ok(it) }

    @PostMapping("/login")
    fun login(
        @RequestBody authenticationLoginRequest: AuthenticationLoginRequest,
        response: HttpServletResponse
    ): ResponseEntity<AccessTokenResponse> =
        authenticationService.authenticate(authenticationLoginRequest)
            .also { addAuthenticationCookie(response, it.value) }
            .let { ResponseEntity.ok(it) }

    @PostMapping("/logout")
    fun logout(
        @AuthenticationPrincipal userId: UserId,
        request: HttpServletRequest,
        response: HttpServletResponse
    ) =
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
        cookie.secure = true
        cookie.isHttpOnly = true
        response.addCookie(cookie)
    }

    private fun invalidateAuthenticationCookie(response: HttpServletResponse) {
        val cookie = Cookie(TOKEN_COOKIE_NAME, "")
        cookie.secure = true
        cookie.isHttpOnly = true
        cookie.maxAge = 0
        response.addCookie(cookie)
    }

}