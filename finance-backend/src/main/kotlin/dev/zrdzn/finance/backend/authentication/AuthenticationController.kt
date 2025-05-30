package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.authentication.dto.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.token.dto.AccessTokenResponse
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.dto.UserCreateRequest
import dev.zrdzn.finance.backend.user.dto.UserResponse
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/authentication")
class AuthenticationController(
    private val userService: UserService,
    private val authenticationService: AuthenticationService
) {

    @PostMapping("/register")
    fun register(
        @RequestBody userCreateRequest: UserCreateRequest,
        response: HttpServletResponse
    ): UserResponse =
        userService.createUser(
            authenticationProvider = AuthenticationProvider.APPLICATION,
            email = userCreateRequest.email,
            username = userCreateRequest.username,
            password = userCreateRequest.password
        )

    @PostMapping("/login")
    fun login(
        @RequestBody authenticationLoginRequest: AuthenticationLoginRequest,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): AccessTokenResponse {
        val ipAddress = request.getHeader("X-Forwarded-For") ?: request.remoteAddr

        return authenticationService
            .authenticate(
                email = authenticationLoginRequest.email,
                password = authenticationLoginRequest.password,
                oneTimePassword = authenticationLoginRequest.oneTimePassword,
                ipAddress = ipAddress
            )
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
