package dev.zrdzn.finance.backend.common.authentication.infrastructure

import dev.zrdzn.finance.backend.api.authentication.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.common.authentication.AuthenticationFacade
import dev.zrdzn.finance.backend.common.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.common.user.UserFacade
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/authentication")
class AuthenticationController(
    private val userFacade: UserFacade,
    private val authenticationFacade: AuthenticationFacade
) {

    @PostMapping("/register")
    fun register(
        @RequestBody userCreateRequest: UserCreateRequest,
        response: HttpServletResponse
    ): ResponseEntity<Unit> =
        userFacade
            .createUser(userCreateRequest)
            .let {
                authenticationFacade.authenticate(
                    AuthenticationLoginRequest(
                        email = userCreateRequest.email,
                        password = userCreateRequest.password
                    )
                )
            }
            .also {
                val cookie = Cookie(TOKEN_COOKIE_NAME, it.value)
                cookie.secure = true
                cookie.isHttpOnly = true
                response.addCookie(cookie)
            }
            .let { ResponseEntity.ok().build() }

}