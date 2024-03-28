package dev.zrdzn.finance.backend.common.authentication

import dev.zrdzn.finance.backend.api.authentication.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenResponse
import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.common.user.UserSpecification
import org.springframework.beans.factory.annotation.Autowired

class AuthenticationSpecification : UserSpecification() {

    @Autowired
    protected lateinit var authenticationFacade: AuthenticationFacade

    fun createUserAndAuthenticate(userCreateRequest: UserCreateRequest = createUserCreateRequest()): AccessTokenResponse =
        userFacade.createUser(userCreateRequest)
            .let {
                authenticationFacade.authenticate(
                    AuthenticationLoginRequest(
                        email = userCreateRequest.email,
                        password = userCreateRequest.password
                    )
                )
            }

}