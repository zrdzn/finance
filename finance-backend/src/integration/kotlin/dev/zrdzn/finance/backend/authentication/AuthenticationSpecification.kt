package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.common.authentication.api.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.common.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.common.user.api.UserCreateRequest
import dev.zrdzn.finance.backend.common.user.UserSpecification

open class AuthenticationSpecification : UserSpecification() {

    protected val authenticationService: AuthenticationService get() = application.getBean(AuthenticationService::class.java)

    fun createAuthenticationLoginRequest(
        email: String = "",
        password: String = ""
    ): AuthenticationLoginRequest =
        AuthenticationLoginRequest(
            email = email,
            password = password
        )

    fun createUserAndAuthenticate(userCreateRequest: UserCreateRequest = createUserCreateRequest()): AccessTokenResponse =
        userService.createUser(userCreateRequest)
            .let {
                authenticationService.authenticate(
                    createAuthenticationLoginRequest(
                        email = userCreateRequest.email,
                        password = userCreateRequest.password
                    )
                )
            }

}