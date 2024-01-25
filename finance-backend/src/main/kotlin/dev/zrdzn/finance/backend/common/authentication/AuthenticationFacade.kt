package dev.zrdzn.finance.backend.common.authentication

import dev.zrdzn.finance.backend.api.authentication.AuthenticationCredentialsInvalidException
import dev.zrdzn.finance.backend.api.authentication.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenResponse
import dev.zrdzn.finance.backend.api.authentication.token.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.api.authentication.token.RefreshTokenCreateResponse
import dev.zrdzn.finance.backend.api.user.UserWithPasswordResponse
import dev.zrdzn.finance.backend.common.authentication.token.TokenFacade
import dev.zrdzn.finance.backend.common.authentication.token.TokenId
import dev.zrdzn.finance.backend.common.user.UserFacade
import org.springframework.security.crypto.password.PasswordEncoder

class AuthenticationFacade(
    private val userFacade: UserFacade,
    private val tokenFacade: TokenFacade,
    private val passwordEncoder: PasswordEncoder
) {

    fun authenticate(authenticationLoginRequest: AuthenticationLoginRequest): AccessTokenResponse =
        getValidatedUser(authenticationLoginRequest)
            ?.let { it to createRefreshToken(it.id).id }
            ?.let { (user, refreshTokenId) -> createAccessToken(user, refreshTokenId) }
            ?: throw AuthenticationCredentialsInvalidException(authenticationLoginRequest.email)

    private fun getValidatedUser(authenticationLoginRequest: AuthenticationLoginRequest): UserWithPasswordResponse? =
        userFacade
            .getUserWithPasswordByEmail(authenticationLoginRequest.email)
            ?.takeIf { passwordEncoder.matches(authenticationLoginRequest.password, it.password) }

    private fun createRefreshToken(userId: Int): RefreshTokenCreateResponse =
        tokenFacade.createRefreshToken(RefreshTokenCreateRequest(userId))

    private fun createAccessToken(userWithPasswordResponse: UserWithPasswordResponse, refreshTokenId: TokenId): AccessTokenResponse =
        tokenFacade
            .createAccessToken(
                AccessTokenCreateRequest(
                    userId = userWithPasswordResponse.id,
                    refreshTokenId = refreshTokenId,
                    email = userWithPasswordResponse.email
                )
            )
            .let { tokenFacade.getAccessTokenDetails(it.value) }

}