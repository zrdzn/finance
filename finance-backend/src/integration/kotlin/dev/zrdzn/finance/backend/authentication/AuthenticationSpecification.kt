package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.authentication.api.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.authentication.token.TokenRepository
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.user.UserSpecification
import dev.zrdzn.finance.backend.user.api.UserCreateRequest

open class AuthenticationSpecification : UserSpecification() {

    protected val authenticationService: AuthenticationService get() = application.getBean(AuthenticationService::class.java)
    protected val tokenRepository: TokenRepository get() = application.getBean(TokenRepository::class.java)

    fun createAuthenticationLoginRequest(
        email: String,
        password: String,
        oneTimePassword: String?
    ): AuthenticationLoginRequest =
        AuthenticationLoginRequest(
            email = email,
            password = password,
            oneTimePassword = oneTimePassword
        )

    fun createUserAndAuthenticate(userCreateRequest: UserCreateRequest = createUserCreateRequest(), ipAddress: String = "192.168.8.10"): AccessTokenResponse =
        userService.createUser(userCreateRequest)
            .let {
                authenticationService.authenticate(
                    authenticationLoginRequest = createAuthenticationLoginRequest(
                        email = userCreateRequest.email,
                        password = userCreateRequest.password,
                        oneTimePassword = null
                    ),
                    ipAddress = ipAddress
                )
            }

}