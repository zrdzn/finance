package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.authentication.api.AuthenticationCredentialsInvalidException
import dev.zrdzn.finance.backend.authentication.api.AuthenticationDetailsResponse
import dev.zrdzn.finance.backend.authentication.api.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.authentication.token.TokenId
import dev.zrdzn.finance.backend.authentication.token.TokenService
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.authentication.token.api.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.authentication.token.api.RefreshTokenCreateResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserWithPasswordResponse
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

    fun logout(accessToken: String) =
        tokenService.removeRefreshToken(tokenService.getAccessTokenDetails(accessToken).refreshTokenId)

    fun getAuthenticationDetailsByUserId(userId: UserId): AuthenticationDetailsResponse =
        userService.getUserById(userId)
            .let {
                AuthenticationDetailsResponse(
                    email = it.email,
                    username = it.username,
                    verified = it.verified
                )
            }

    private fun createRefreshToken(userId: Int): RefreshTokenCreateResponse =
        tokenService.createRefreshToken(RefreshTokenCreateRequest(userId))

    private fun createAccessToken(
        userWithPasswordResponse: UserWithPasswordResponse,
        refreshTokenId: TokenId
    ): AccessTokenResponse =
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
            .takeIf { passwordEncoder.matches(authenticationLoginRequest.password, it.password) }

}