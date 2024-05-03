package dev.zrdzn.finance.backend.common.authentication

import dev.zrdzn.finance.backend.api.authentication.AuthenticationCredentialsInvalidException
import dev.zrdzn.finance.backend.api.authentication.AuthenticationDetailsResponse
import dev.zrdzn.finance.backend.api.authentication.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenResponse
import dev.zrdzn.finance.backend.api.authentication.token.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.api.authentication.token.RefreshTokenCreateResponse
import dev.zrdzn.finance.backend.api.user.UserWithPasswordResponse
import dev.zrdzn.finance.backend.common.authentication.token.TokenService
import dev.zrdzn.finance.backend.common.authentication.token.TokenId
import dev.zrdzn.finance.backend.common.user.UserService
import dev.zrdzn.finance.backend.common.user.UserId
import org.springframework.security.crypto.password.PasswordEncoder

class AuthenticationService(
    private val userService: UserService,
    private val tokenService: TokenService,
    private val passwordEncoder: PasswordEncoder
) {

    fun authenticate(authenticationLoginRequest: AuthenticationLoginRequest): AccessTokenResponse =
        getValidatedUser(authenticationLoginRequest)
            ?.let { it to createRefreshToken(it.id).id }
            ?.let { (user, refreshTokenId) -> createAccessToken(user, refreshTokenId) }
            ?: throw AuthenticationCredentialsInvalidException(authenticationLoginRequest.email)

    fun logout(accessToken: String) = tokenService.removeRefreshToken(tokenService.getAccessTokenDetails(accessToken).refreshTokenId)

    fun getAuthenticationDetailsByUserId(userId: UserId): AuthenticationDetailsResponse? =
        userService.getUserById(userId)
            ?.let {
                AuthenticationDetailsResponse(
                    email = it.email,
                    username = it.username
                )
            }

    private fun createRefreshToken(userId: Int): RefreshTokenCreateResponse =
        tokenService.createRefreshToken(RefreshTokenCreateRequest(userId))

    private fun createAccessToken(userWithPasswordResponse: UserWithPasswordResponse, refreshTokenId: TokenId): AccessTokenResponse =
        tokenService
            .createAccessToken(
                AccessTokenCreateRequest(
                    userId = userWithPasswordResponse.id,
                    refreshTokenId = refreshTokenId,
                    email = userWithPasswordResponse.email
                )
            )
            .let { tokenService.getAccessTokenDetails(it.value) }

    private fun getValidatedUser(authenticationLoginRequest: AuthenticationLoginRequest): UserWithPasswordResponse? =
        userService
            .getUserWithPasswordByEmail(authenticationLoginRequest.email)
            ?.takeIf { passwordEncoder.matches(authenticationLoginRequest.password, it.password) }

}