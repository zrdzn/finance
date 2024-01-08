package dev.zrdzn.finance.backend.common.authentication.infrastructure

import dev.zrdzn.finance.backend.api.authentication.AuthenticationResponse
import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.common.authentication.AuthenticationFacade
import dev.zrdzn.finance.backend.common.user.UserFacade
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
        @RequestBody userCreateRequest: UserCreateRequest
    ): AuthenticationResponse =
        userFacade
            .createUser(userCreateRequest)
            .let { authenticationFacade.authenticate(it) }

}